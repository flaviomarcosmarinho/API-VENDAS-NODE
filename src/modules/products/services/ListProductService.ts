import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository);

    //Cache com Redis antes de fazer o find no Postgres.
    const redisCache = new RedisCache();

    //Primeiro procura no cache (Redis)
    let products = await redisCache.recover<Product[]>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await productsRepository.find(); //Caso não tenha no cache, ai sim busca no postgres

      await redisCache.save('api-vendas-PRODUCT_LIST', products); //e em seguida insere no cache (Redis)
    }

    return products;
  }
}

export default ListProductService;
