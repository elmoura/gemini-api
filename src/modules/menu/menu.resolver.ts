// import { Args, Query, Resolver } from '@nestjs/graphql';
// import { GetMenuUseCase } from './usecases/get-menu.usecase';
// import { MenuObj } from './usecases/dto/menu.object';
// import { GetMenuInput } from './usecases/dto/get-menu.input';

// @Resolver()
// export class MenuResolver {
//   constructor(private getMenuUseCase: GetMenuUseCase) {}

//   @Query(() => MenuObj)
//   async getMenu(@Args('input') input: GetMenuInput): Promise<MenuObj> {
//     console.log(input);

//     return this.getMenuUseCase.execute(input);
//   }
// }
