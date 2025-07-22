import { DataSource } from 'typeorm';

/**
 * Referencia global al DataSource de TypeORM.
 * Se debe inicializar llamando a setDataSource() en el bootstrap de la app.
 */
let dataSource: DataSource;

/**
 * Inicializa el DataSource global para el decorador transaccional.
 * Debe llamarse una vez, al arrancar la aplicación (por ejemplo, en main.ts):
 *
 *   const dataSource = app.get(DataSource);
 *   setDataSource(dataSource);
 */
export function setDataSource(ds: DataSource) {
  dataSource = ds;
}

/**
 * Decorador de método para ejecutar la función dentro de una transacción de TypeORM.
 *
 * - Abre una transacción antes de ejecutar el método.
 * - Inyecta el EntityManager transaccional como último argumento del método decorado.
 * - Hace commit si todo sale bien, o rollback si hay error.
 *
 * Uso:
 *
 *   @Transactional()
 *   async miMetodo(arg1, arg2, manager?: EntityManager) {
 *     // Usar manager para todas las operaciones de BD
 *   }
 *
 * Requiere que setDataSource() haya sido llamado en el bootstrap.
 */
export function Transactional() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>;
    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      if (!dataSource) {
        throw new Error(
          'DataSource not set. Call setDataSource() at app bootstrap.',
        );
      }
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // Pasa el EntityManager transaccional como último argumento
        const result: unknown = await originalMethod.apply(this, [
          ...args,
          queryRunner.manager,
        ]);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    };
    return descriptor;
  };
}
