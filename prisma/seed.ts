import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminExist = await prisma.admin.findUnique({
    where: { username: 'postgres' },
  });

  if (!adminExist) {
    await prisma.admin.create({
      data: {
        username: 'postgres',
        email: '',
        password: '',
      },
    });
  } else {
    console.log('Admin já existe.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function seed() {
  try {
    await prisma.product.createMany({
      data: [
        { title: 'Notebook Samsung Galaxy Book2' },
        { title: 'iPhone 14' },
        { title: "Smartwatch Amazfit Gts 4'" },
      ],
      skipDuplicates: true,
    });

    const products = await prisma.product.findMany();

    const productMap = products.reduce(
      (acc, product) => {
        acc[product.title] = product.id;
        return acc;
      },
      {} as { [key: string]: number },
    );

    await prisma.price.createMany({
      data: [
        {
          value: 263744,
          productId: productMap['Notebook Samsung Galaxy Book2'],
        },
        { value: 306661, productId: productMap['iPhone 14'] },
        { value: 342833, productId: productMap["Smartwatch Amazfit Gts 4'"] },
      ],
    });

    await prisma.productDetail.createMany({
      data: [
        {
          image_url:
            'https://samsungbrshop.vtexassets.com/arquivos/ids/195462-800-auto?v=637959156198500000&width=800&height=auto&aspect=true',
          price: 330202,
          rating: 2,
          scraped_from_url:
            'https://shop.samsung.com/br/samsung-galaxy-book2-w11h-intel-core-i5-np550xed-kf2br/p',
          seller: 'Samsung',
          seller_url: 'https://shop.samsung.com',
          title: 'Notebook Samsung Galaxy Book2 Intel Core i5-1235U',
          productId: productMap['Notebook Samsung Galaxy Book2'],
        },
        {
          image_url:
            'https://m.media-amazon.com/images/I/51wJreDCHfL._AC_SX425_.jpg',
          price: 336892,
          rating: 3,
          scraped_from_url:
            'https://www.amazon.com.br/Notebook-Samsung-i5-1235U-Windows-Grafite/dp/B0C5YT4KQZ',
          seller: 'Amazon',
          seller_url: 'https://www.amazon.com.br/',
          title: 'Galaxy Book2 Intel® Core™ i5-1235U, Windows 11 Home',
          productId: productMap['Notebook Samsung Galaxy Book2'],
        },
        {
          image_url:
            'https://a-static.mlcdn.com.br/800x560/notebook-samsung-galaxy-book-2-intel-core-i5-8gb-ssd-256gb-156-full-hd-windows-11-np550xed-kf2br/magazineluiza/238037000/45853b41ecada0baf03da053be05e526.jpg',
          price: 286852,
          rating: 4,
          scraped_from_url:
            'https://www.magazineluiza.com.br/notebook-samsung-galaxy-book-2-intel-core-i5-8gb-ssd-256gb-156-full-hd-windows-11-np550xed-kf2br/p/238037000/in/nsbo',
          seller: 'Magazineluiza',
          seller_url: 'https://www.magazineluiza.com.br',
          title: 'Notebook Samsung Galaxy Book 2 Intel Core i5 8GB',
          productId: productMap['Notebook Samsung Galaxy Book2'],
        },
        {
          image_url:
            'https://images.kabum.com.br/produtos/fotos/520072/notebook-galaxy-book2-intel-core-i5-1235u-windows-11-home-8gb-256gb-ssd-intel-iris-xe-15-6-full-hd-led-np550xed-kf2br_1706818190_gg.jpg',
          price: 364402,
          rating: 5,
          scraped_from_url:
            'https://www.kabum.com.br/produto/520072/notebook-samsung-galaxy-book2-intel-core-i5-1235u-8gb-ram-ssd-256gb-15-6-full-hd-windows-11-home-grafite-np550xed-kf2br',
          seller: 'Kabum',
          seller_url: 'https://www.kabum.com.br/',
          title: 'Notebook Samsung Galaxy Book2 Intel Core i5',
          productId: productMap['Notebook Samsung Galaxy Book2'],
        },
        {
          image_url:
            'https://m.media-amazon.com/images/I/41t1UNX2zHL._AC_SL1000_.jpg',
          price: 350728,
          rating: 1,
          scraped_from_url:
            'https://www.amazon.com.br/Apple-iPhone-14-128-GB/dp/B00CLP06OW/ref=sr_1_3?dib=eyJ2IjoiMSJ9.3Iq3Nv7YXbAZG1AV-JA6_Ri0GYXVpHHZapL2Cwlw3o4OAfh4m3-3mhys04I0uTmDNrWTfw8_QfeBzDCD3EO3Tkacsiafv-xB_FXkoL0TxdUNHE3TRGkQiA4bxTA1uMHz-B6fQrq_V2ez3l4fdxj6v3jh5QF_l8df39ruY1iGv-MGRcUDA8_gjnrk2C2duT1YrSO-KvAHv9fpEaeqoqPJXxpPYy8XzqYpOUCp2dHX-SvrrbDEjsrsRSKf4Z0Z7ux4JDcfGP4FRgk41mqheTDOztBpfQ6AirvsduGaPzvuMzY.KGoi7E-GjP495CnSMxoLNyNaoDWIWGytcehkGkoZuWM&dib_tag=se&keywords=iphone+14&qid=1712000359&sr=8-3&ufe=app_do%3Aamzn1.fos.95de73c3-5dda-43a7-bd1f-63af03b14751',
          seller: 'Amazon',
          seller_url: 'https://www.amazon.com.br',
          title: 'Apple iPhone 14 (128 GB) – Estelar',
          productId: productMap['iPhone 14'],
        },
        {
          image_url:
            'https://www.tradeinn.com/f/13933/139331604/apple-iphone-14-128gb-6.1.jpg',
          price: 321206,
          rating: 3,
          scraped_from_url:
            'https://www.tradeinn.com/techinn/pt/apple-iphone-14-128gb-6.1/139331604/p?utm_source=google_products&utm_medium=merchant&id_producte=17677383&country=br&srsltid=AfmBOopIttrnMPZmW3hrKHcS7nrjOO4ICWDobj9vo0x66YE5ImIBY1AwMvM',
          seller: 'Tradeinn',
          seller_url: 'https://www.tradeinn.com',
          title: 'Apple IPhone 14 128GB 6.1',
          productId: productMap['iPhone 14'],
        },
        {
          image_url:
            'https://a-static.mlcdn.com.br/800x560/apple-iphone-14-128gb-estelar-61-12mp-ios-5g/magazineluiza/237184100/b208242666e673bb1cfff75f61667947.jpg',
          price: 404655,
          rating: 3,
          scraped_from_url:
            'https://www.magazineluiza.com.br/apple-iphone-14-128gb-estelar-61-12mp-ios-5g/p/237184100/te/ip14',
          seller: 'Magazineluiza',
          seller_url: 'https://www.magazineluiza.com.br',
          title: 'Apple IPhone 14 128GB 6.1',
          productId: productMap['iPhone 14'],
        },
        {
          image_url:
            'https://http2.mlstatic.com/D_NQ_NP_933553-MLU73420562169_122023-O.webp',
          price: 56479,
          rating: 3,
          scraped_from_url:
            'https://www.mercadolivre.com.br/smartwatch-amazfit-gts-4-mini-165-a2176-black/p/MLB19810451',
          seller: 'Mercado Livre',
          seller_url: 'https://www.mercadolivre.com.br',
          title: 'Smartwatch Amazfit Gts 4 Mini A2176',
          productId: productMap["Smartwatch Amazfit Gts 4'"],
        },
        {
          image_url:
            'https://images.tcdn.com.br/img/img_prod/854435/relogio_smartwatch_xiaomi_amazfit_gts_4_mini_preto_a_prova_d_agua_50_metros_oximetro_a2176_104065_1_133f08cfcbb76781828a3d96b576be46.jpeg',
          price: 76900,
          rating: 1,
          scraped_from_url:
            'https://www.xtremeinfo.com.br/smartphones-e-gadgests/relogios-smartwatch/relogio-smartwatch-xiaomi-amazfit-gts-4-mini-preto-a-prova-d-agua-50-metros-oximetro-a2176',
          seller: 'Xtreme Informática',
          seller_url: 'https://www.xtremeinfo.com.br',
          title: 'Relógio Smartwatch XIAOMI Amazfit GTS 4 Mini Preto',
          productId: productMap["Smartwatch Amazfit Gts 4'"],
        },
        {
          image_url:
            'https://m.media-amazon.com/images/I/51UECNWIuAL._AC_SY679_.jpg',
          price: 67193,
          rating: 2,
          scraped_from_url:
            'https://www.amazon.com.br/Amazfit-Reconhecimento-Inteligente-Posicionamento-dias_Flamingo/dp/B0B8N8SDT1',
          seller: 'Amazon',
          seller_url: 'https://www.amazon.com.br',
          title:
            'Amazfit GTS 4 Mini 120+ Modos Esportivos e Reconhecimento Inteligente',
          productId: productMap["Smartwatch Amazfit Gts 4'"],
        },
        {
          image_url:
            'https://m.media-amazon.com/images/I/61fYIhvPnfL._AC_SX522_.jpg',
          price: 67301,
          rating: 3,
          scraped_from_url:
            'https://www.amazon.com.br/Amazfit-smartwatch-rastreador-exerc%C3%ADcio-compat%C3%ADvel/dp/B0D25P367Q',
          seller: 'Amazon',
          seller_url: 'https://www.amazon.com.br',
          title:
            'Amazfit GTS 4 mini smartwatch para homens e mulheres, Alexa GPS',
          productId: productMap["Smartwatch Amazfit Gts 4'"],
        },
      ],
    });

    console.log('Seed concluído com sucesso.');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
seed();
