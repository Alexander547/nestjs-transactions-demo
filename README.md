<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Transactions Demo

Este proyecto demuestra cómo implementar y usar **decoradores personalizados para transacciones** en NestJS con TypeORM, incluyendo teoría, ventajas, niveles de aislamiento y ejemplos prácticos.

---

## Tabla de Contenidos
- [¿Por qué transacciones?](#por-qué-transacciones)
- [Teoría: Niveles de aislamiento](#teoría-niveles-de-aislamiento)
- [Decoradores personalizados](#decoradores-personalizados)
  - [@Transactional (básico)](#transactional-básico)
  - [@TransactionalAdvanced (avanzado)](#transactionaladvanced-avanzado)
  - [Tabla comparativa](#tabla-comparativa)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Ventajas y recomendaciones](#ventajas-y-recomendaciones)
- [Referencias](#referencias)

---

## ¿Por qué transacciones?
Las transacciones permiten agrupar varias operaciones de base de datos en una sola unidad atómica: **o se completan todas, o ninguna**. Esto es fundamental para mantener la integridad de los datos, especialmente cuando hay múltiples escrituras o actualizaciones relacionadas.

---

## Teoría: Niveles de aislamiento
El **nivel de aislamiento** de una transacción determina cómo interactúa tu transacción con otras concurrentes. Los principales niveles son:

| Nivel                | Dirty Reads | Non-repeatable Reads | Phantom Reads | Seguridad | Rendimiento |
|----------------------|:-----------:|:-------------------:|:-------------:|:---------:|:-----------:|
| READ UNCOMMITTED     |     Sí      |         Sí          |      Sí       |    Baja   |    Alta     |
| READ COMMITTED       |     No      |         Sí          |      Sí       |  Media    |    Alta     |
| REPEATABLE READ      |     No      |         No          |      Sí       |   Alta    |   Media     |
| SERIALIZABLE         |     No      |         No          |      No       |  Máxima   |    Baja     |

- **Dirty Reads:** Leer datos no confirmados por otras transacciones.
- **Non-repeatable Reads:** Leer el mismo dato dos veces y obtener valores diferentes.
- **Phantom Reads:** El resultado de una consulta cambia si otra transacción inserta/borra filas.

**Ejemplo:**
- `READ COMMITTED` (por defecto en la mayoría de bases): solo puedes leer datos confirmados, pero los datos pueden cambiar entre lecturas.
- `SERIALIZABLE`: máxima seguridad, las transacciones se comportan como si fueran una tras otra.

Más info: [TypeORM Transactions](https://typeorm.io/transactions), [PostgreSQL Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

---

## Decoradores personalizados

### @Transactional (básico)
- Centraliza la lógica de transacciones.
- Inyecta el `EntityManager` transaccional como último argumento del método decorado.
- Uso:
  ```typescript
  @Transactional()
  async miMetodo(args..., manager?: EntityManager) {
    // ...
  }
  ```
- Inicializa en el bootstrap:
  ```typescript
  setDataSource(app.get(DataSource));
  ```

### @TransactionalAdvanced (avanzado)
- Permite especificar el DataSource (multi-bases).
- Permite elegir el nivel de aislamiento (`isolationLevel`).
- Soporta transacciones anidadas (reutiliza el manager si ya existe).
- Permite logging de errores.
- Uso:
  ```typescript
  @TransactionalAdvanced({
    dataSource: OrderService.secondaryDataSource,
    logErrors: true,
    isolationLevel: 'SERIALIZABLE',
  })
  async miMetodo(args..., manager?: EntityManager) {
    // ...
  }
  ```
- Inicializa en el bootstrap:
  ```typescript
  setDefaultDataSource(app.get(DataSource));
  ```

#### Tabla comparativa

| Característica                        | @Transactional (básico) | @TransactionalAdvanced (avanzado) |
|----------------------------------------|-------------------------|-----------------------------------|
| DataSource configurable                | No                      | Sí                                |
| Nivel de aislamiento configurable      | No                      | Sí                                |
| Transacciones anidadas                 | No                      | Sí                                |
| Logging de errores                     | No                      | Sí                                |
| Uso recomendado                        | Casos simples           | Casos avanzados/multi-DB          |

---

## Ejemplos de uso

### 1. Método transaccional básico
```typescript
@Transactional()
async crearUsuario(email: string, name: string, manager?: EntityManager) {
  const user = await manager.save(User, { email, name });
  // ...
  return user;
}
```

### 2. Método transaccional avanzado (multi-DB, logging, aislamiento)
```typescript
@TransactionalAdvanced({
  dataSource: OrderService.secondaryDataSource,
  logErrors: true,
  isolationLevel: 'READ COMMITTED',
})
async createOrderWithSecondaryDataSource(
  userId: number,
  items: { name: string; price: number }[],
  manager?: EntityManager,
): Promise<Order> {
  // ...
}
```

### 3. Ejemplos con diferentes isolationLevel

#### a) READ UNCOMMITTED
> Permite leer datos no confirmados por otras transacciones (lecturas sucias). Rara vez recomendado.
```typescript
@TransactionalAdvanced({ isolationLevel: 'READ UNCOMMITTED' })
async metodoLecturaNoConfirmada(manager?: EntityManager) {
  // ...
}
```

#### b) READ COMMITTED
> Solo puedes leer datos confirmados. Es el valor por defecto en la mayoría de bases de datos.
```typescript
@TransactionalAdvanced({ isolationLevel: 'READ COMMITTED' })
async metodoLecturaConfirmada(manager?: EntityManager) {
  // ...
}
```

#### c) REPEATABLE READ
> Garantiza que si lees un dato dos veces, obtendrás el mismo valor. Útil para reportes o procesos críticos.
```typescript
@TransactionalAdvanced({ isolationLevel: 'REPEATABLE READ' })
async metodoLecturaRepetible(manager?: EntityManager) {
  // ...
}
```

#### d) SERIALIZABLE
> Máxima seguridad: la transacción se comporta como si fuera la única en el sistema. Útil para operaciones bancarias o de alta integridad.
```typescript
@TransactionalAdvanced({ isolationLevel: 'SERIALIZABLE' })
async metodoSerializado(manager?: EntityManager) {
  // ...
}
```

---

## Ventajas y recomendaciones

- **Centralizas la lógica de transacciones**: menos repetición de código.
- **Atomicidad garantizada**: si algo falla, nada se guarda.
- **Flexibilidad**: el decorador avanzado permite multi-DB, logging y control granular.
- **Recomendación**: usa el decorador básico para casos simples y el avanzado para escenarios complejos o multi-bases.
- **Siempre usa el `EntityManager` recibido** en los métodos decorados y pásalo a los servicios auxiliares.

---

## Referencias
- [TypeORM Transactions](https://typeorm.io/transactions)
- [PostgreSQL Isolation Levels](https://www.postgresql.org/docs/current/transaction-iso.html)
- [NestJS + TypeORM Transactions](https://docs.nestjs.com/techniques/database#transactions)

---

¿Dudas? ¡Revisa los ejemplos en el código fuente o consulta la documentación enlazada!

### 4. Ejemplo de transacción anidada
> Cuando un método decorado llama a otro decorado y le pasa el manager, ambos comparten la misma transacción.

```typescript
// Método padre: inicia la transacción
@TransactionalAdvanced({ isolationLevel: 'SERIALIZABLE', logErrors: true })
async crearOrdenConSuborden(
  userId: number,
  items: { name: string; price: number }[],
  subItems: { name: string; price: number }[],
  manager?: EntityManager,
): Promise<{ orden: Order; suborden: Order }> {
  const orden = await this.createOrderAdvancedTransactional(
    userId,
    items,
    manager,
  );
  const suborden = await this.crearSubOrden(userId, subItems, manager);
  return { orden, suborden };
}

// Método hijo: si recibe manager, no crea nueva transacción
@TransactionalAdvanced({ isolationLevel: 'SERIALIZABLE', logErrors: true })
async crearSubOrden(
  userId: number,
  items: { name: string; price: number }[],
  manager?: EntityManager,
): Promise<Order> {
  // ... lógica ...
}
```

**¿Cómo probarlo?**

POST `/order/tx-anidada`
```json
{
  "userId": 1,
  "items": [
    { "name": "Producto 1", "price": 100 }
  ],
  "subItems": [
    { "name": "Producto 2", "price": 200 }
  ]
}
```

> Si ocurre un error en cualquiera de los métodos, se hace rollback de toda la transacción (ni la orden ni la suborden se guardan).

---
