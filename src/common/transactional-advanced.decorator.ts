/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  DataSource,
  EntityManager,
  QueryRunner,
  // IsolationLevel, // TypeORM no exporta este tipo, usar string
} from 'typeorm';

/**
 * Opciones para el decorador avanzado.
 *
 * @property dataSource DataSource específico a usar (opcional)
 * @property isolationLevel Nivel de aislamiento de la transacción (opcional, string: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE')
 * @property logErrors Si es true, loggea los errores de la transacción (opcional)
 */
export interface TransactionalOptions {
  dataSource?: DataSource;
  isolationLevel?: string; // TypeORM acepta string para isolationLevel
  logErrors?: boolean;
}

let defaultDataSource: DataSource;

/**
 * Inicializa el DataSource por defecto para el decorador avanzado.
 * Debe llamarse en el bootstrap de la app:
 *
 *   setDefaultDataSource(app.get(DataSource));
 */
export function setDefaultDataSource(ds: DataSource) {
  defaultDataSource = ds;
}

/**
 * Decorador avanzado para ejecutar un método dentro de una transacción de TypeORM.
 *
 * Características:
 * - Soporta transacciones anidadas (no crea una nueva si ya hay EntityManager).
 * - Permite especificar DataSource y nivel de aislamiento.
 * - Inyecta el EntityManager transaccional como último argumento.
 * - Permite logging opcional de errores.
 *
 * Uso básico:
 *
 *   @TransactionalAdvanced()
 *   async miMetodo(args..., manager?: EntityManager) { ... }
 *
 * Uso avanzado:
 *
 *   @TransactionalAdvanced({ logErrors: true, isolationLevel: 'SERIALIZABLE' })
 *   async miMetodo(args..., manager?: EntityManager) { ... }
 *
 * @param options Opciones avanzadas de transacción
 */
export function TransactionalAdvanced(options: TransactionalOptions = {}) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      // Si ya hay un EntityManager como último argumento, usarlo (transacción anidada)
      const lastArg = args[args.length - 1];
      if (lastArg instanceof EntityManager) {
        return originalMethod.apply(this, args);
      }

      // Usar DataSource especificado o el default
      const dataSource = options.dataSource ?? defaultDataSource;
      if (!dataSource) {
        throw new Error(
          'DataSource not set. Call setDefaultDataSource() at app bootstrap.',
        );
      }

      const queryRunner: QueryRunner = dataSource.createQueryRunner();
      try {
        await queryRunner.connect();
        // TypeORM acepta isolationLevel como string
        await queryRunner.startTransaction(options.isolationLevel as any);
        const result = await originalMethod.apply(this, [
          ...args,
          queryRunner.manager,
        ]);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        if (options.logErrors) {
          // eslint-disable-next-line no-console
          console.error(
            `[TransactionalAdvanced] Error in ${propertyKey}:`,
            error,
          );
        }
        throw error;
      } finally {
        if (!queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    };
    return descriptor;
  };
}
