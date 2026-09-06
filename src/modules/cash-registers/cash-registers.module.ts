import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import {
  OrderTab,
  OrderTabSchema,
} from '@modules/table-orders/entities/order-tab';
import { CashRegistersResolver } from './cash-registers.resolver';
import { CashMovementDataSource } from './datasources/cash-movement.datasource';
import { CashRegisterPaymentSummaryDataSource } from './datasources/cash-register-payment-summary.datasource';
import { CashRegisterDataSource } from './datasources/cash-register.datasource';
import { CashMovement, CashMovementSchema } from './entities/cash-movement';
import { CashRegister, CashRegisterSchema } from './entities/cash-register';
import { CloseCashRegisterUseCase } from './usecases/close-cash-register.usecase';
import { GetCurrentCashRegisterUseCase } from './usecases/get-current-cash-register.usecase';
import { ListCashMovementsUseCase } from './usecases/list-cash-movements.usecase';
import { ListCashRegistersUseCase } from './usecases/list-cash-registers.usecase';
import { OpenCashRegisterUseCase } from './usecases/open-cash-register.usecase';
import { RegisterCashMovementUseCase } from './usecases/register-cash-movement.usecase';

/**
 * Módulo FOLHA no grafo de DI (ADR-5): não importa `TableOrdersModule` nem
 * `LocationShiftsModule`. Registra o schema de `OrderTab` localmente só para
 * ler `order_tabs` em modo read-only na apuração de resumo.
 */
@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CashRegister.name, schema: CashRegisterSchema },
      { name: CashMovement.name, schema: CashMovementSchema },
      { name: OrderTab.name, schema: OrderTabSchema },
    ]),
  ],
  providers: [
    CashRegistersResolver,
    CashRegisterDataSource,
    CashMovementDataSource,
    CashRegisterPaymentSummaryDataSource,
    OpenCashRegisterUseCase,
    CloseCashRegisterUseCase,
    GetCurrentCashRegisterUseCase,
    ListCashRegistersUseCase,
    RegisterCashMovementUseCase,
    ListCashMovementsUseCase,
  ],
  exports: [CashRegisterDataSource],
})
export class CashRegistersModule {}
