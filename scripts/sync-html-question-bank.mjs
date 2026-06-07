import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputPath = path.join(root, '.scratch', 'questions.jsonl')
const outputDir = path.join(root, 'docs', 'html', 'question-bank')

const handledQuestionIds = new Set([
  // Low-quality or off-topic records removed from the HTML candidate bank.
  'poetries__fe__interview__questions__f29b9853e3',
  'haizlin__fe__interview__12486f43d9',
  'poetries__fe__interview__questions__ccd0080979',
  'poetries__fe__interview__questions__35ca7351cd',
  'lgwebdream__fe__interview__29c5555486',

  // Semantic/accessibility topics migrated into docs/html/semantics/semantic-html.md.
  'haizlin__fe__interview__55810b928d',
  'haizlin__fe__interview__132eca00b7',
  'haizlin__fe__interview__312f6e1679',
  'haizlin__fe__interview__f9d2f32d42',
  'haizlin__fe__interview__74ee1761f2',
  'haizlin__fe__interview__2984fead47',
  'haizlin__fe__interview__e1f12e51ac',
  'haizlin__fe__interview__536fdcc7dc',
  'poetries__fe__interview__questions__3e9aa37010',
  'poetries__fe__interview__questions__e0b6183b09',
  'haizlin__fe__interview__e3daa79893',

  // Resource loading topics migrated into docs/html/resource-loading/.
  'poetries__fe__interview__questions__14cdbf386a',
  'haizlin__fe__interview__b2eaad1a08',
  'haizlin__fe__interview__684a2ba99d',
  'haizlin__fe__interview__fa93511cba',
  'haizlin__fe__interview__15cd2acdfc',
  'lgwebdream__fe__interview__115ba2a3a7',
  'haizlin__fe__interview__60cee3a7af',
  'poetries__fe__interview__questions__eec774bb2a',
  'poetries__fe__interview__questions__e8d8603d53',
  'haizlin__fe__interview__363beff8d6',
  'lgwebdream__fe__interview__4a465f95e2',
  'haizlin__fe__interview__fabde4f0b8',
  'haizlin__fe__interview__3c0ac5658c',
  'haizlin__fe__interview__0c000b8625',
  'haizlin__fe__interview__b31aa20e48',
  'poetries__fe__interview__questions__f8567e0689',
  'haizlin__fe__interview__5c09a22781',
  'haizlin__fe__interview__7df1ec7090',
  'lgwebdream__fe__interview__8cefe0830c',
  'lgwebdream__fe__interview__93b2b0cc05',
  'haizlin__fe__interview__8a70c6aa3b',

  // Document-structure topics migrated into docs/html/document-structure/.
  'haizlin__fe__interview__ebcc72835d',
  'haizlin__fe__interview__3130574cf5',
  'haizlin__fe__interview__a4af9d72bd',
  'haizlin__fe__interview__8abc1fc727',
  'haizlin__fe__interview__9f63503eea',
  'haizlin__fe__interview__271bc2b2c0',
  'haizlin__fe__interview__b6f4353795',
  'haizlin__fe__interview__833021bda0',
  'haizlin__fe__interview__f6529e4e09',
  'haizlin__fe__interview__3fbe40eb9f',
  'haizlin__fe__interview__29b20445a4',
  'haizlin__fe__interview__e737349091',
  'haizlin__fe__interview__60223efdda',
  'haizlin__fe__interview__b40d1bbc4e',
  'haizlin__fe__interview__d80f2e6066',
  'haizlin__fe__interview__18ad7b6282',
  'haizlin__fe__interview__cd1549af33',
  'haizlin__fe__interview__74752ce74e',
  'haizlin__fe__interview__07b72fcc8a',
  'haizlin__fe__interview__900de98604',
  'haizlin__fe__interview__eb31ba52a5',
  'haizlin__fe__interview__f94d5e377f',
  'haizlin__fe__interview__e064c57b7d',
  'haizlin__fe__interview__8e0bdc0e09',
  'haizlin__fe__interview__9af947bcfc',
  'haizlin__fe__interview__eb3af3e983',
  'haizlin__fe__interview__399f0abf4a',
  'haizlin__fe__interview__8226839d24',
  'haizlin__fe__interview__205448aec3',
  'haizlin__fe__interview__8ec230f7e5',
  'haizlin__fe__interview__4b70663c7f',
  'haizlin__fe__interview__fa3ee8df24',
  'haizlin__fe__interview__52a4a2d7b6',
  'haizlin__fe__interview__fbc7ebd406',
  'haizlin__fe__interview__4fb2b9060b',
  'poetries__fe__interview__questions__0fca82bb92',
  'poetries__fe__interview__questions__7eb32d694b',
  'poetries__fe__interview__questions__c4f2edfa84',
  'poetries__fe__interview__questions__7b474ceb09',
  'poetries__fe__interview__questions__bbcdceb5bb',
  'poetries__fe__interview__questions__d269531e01',
  'poetries__fe__interview__questions__872286450e',
  'poetries__fe__interview__questions__0b0b0bed12',
  'poetries__fe__interview__questions__115674e407',
  'poetries__fe__interview__questions__ea0ee84d77',
  'poetries__fe__interview__questions__07f32b80bd',
  'poetries__fe__interview__questions__ac154e9aae',
  'poetries__fe__interview__questions__df713b7d86',
  'poetries__fe__interview__questions__09c12b5a60',
  'poetries__fe__interview__questions__f4f042e965',
  'haizlin__fe__interview__b3016f169d',

  // Storage/offline candidate page migrated into target docs across HTML, CSS, and Network.
  'haizlin__fe__interview__a5d29257f0',
  'haizlin__fe__interview__71f0005c32',
  'haizlin__fe__interview__109f05fec5',
  'haizlin__fe__interview__8c37bce1f6',
  'haizlin__fe__interview__6619c072d4',
  'poetries__fe__interview__questions__e4e7d7d6d1',
  'poetries__fe__interview__questions__2a8c605bbe',
  'haizlin__fe__interview__986f9d4ec2',
  'haizlin__fe__interview__8f1d886c86',
  'haizlin__fe__interview__0203021574',
  'haizlin__fe__interview__9eb50c62b5',
  'haizlin__fe__interview__4f238432a3',
  'poetries__fe__interview__questions__0083bde2e0',
  'lgwebdream__fe__interview__7aaec90a4d',
  'poetries__fe__interview__questions__5fdd32df88',
  'haizlin__fe__interview__70b9b7c755',
  'haizlin__fe__interview__404f609fcc',
  'haizlin__fe__interview__dc0964cc84',
  'poetries__fe__interview__questions__70d05c54ff',
  'haizlin__fe__interview__d81dda1f8f',
  'haizlin__fe__interview__dbdaee2e4d',
  'haizlin__fe__interview__0cf10d3941',
  'haizlin__fe__interview__f956ae342a',
  'haizlin__fe__interview__d2655d2a7f',
  'haizlin__fe__interview__02829e0aa5',
  'haizlin__fe__interview__5b9f7e78f4',
  'haizlin__fe__interview__aae8578576',
  'poetries__fe__interview__questions__7480927a1b',
  'haizlin__fe__interview__5b51ca8d0d',
  'haizlin__fe__interview__22241651bf',
  'poetries__fe__interview__questions__24ed407613',
  'haizlin__fe__interview__1b6ab7f5e5',
  'poetries__fe__interview__questions__a357cac21a',

  // Links/navigation candidate page migrated into target docs across HTML, CSS, Network, Forms, and JavaScript.
  'lgwebdream__fe__interview__304a59f0ff',
  'haizlin__fe__interview__60fd3bcb50',
  'haizlin__fe__interview__75dfa1f955',
  'haizlin__fe__interview__0479b170eb',
  'haizlin__fe__interview__01183cc8b4',
  'haizlin__fe__interview__bd489b29f8',
  'haizlin__fe__interview__6453e6c9b0',
  'haizlin__fe__interview__ddbc4c6011',
  'haizlin__fe__interview__a3b06d366e',
  'haizlin__fe__interview__e2e2a9072f',
  'haizlin__fe__interview__87fb591755',
  'poetries__fe__interview__questions__85dbd49e90',
  'poetries__fe__interview__questions__67ac48a25b',
  'haizlin__fe__interview__70ac5db518',
  'haizlin__fe__interview__5003c8ba74',
  'haizlin__fe__interview__d2b8bf5301',
  'lgwebdream__fe__interview__731bc4a866',
  'poetries__fe__interview__questions__c6c2938d29',
  'haizlin__fe__interview__c8bc144445',
  'haizlin__fe__interview__4a756e05bb',
  'haizlin__fe__interview__c71205d05f',
  'haizlin__fe__interview__5b75cf5641',
  'haizlin__fe__interview__2a2ac374a0',
  'haizlin__fe__interview__e430fb4f3f',
  'haizlin__fe__interview__4e55b1a46b',
  'haizlin__fe__interview__8a4fd711a0',
  'haizlin__fe__interview__676bfc0d04',
  'haizlin__fe__interview__3c452aa92d',
  'haizlin__fe__interview__7d075a2c5a',
  'haizlin__fe__interview__c8c572b22a',
  'haizlin__fe__interview__36eb42c0d6',
  'haizlin__fe__interview__2c5fec8fa4',
  'poetries__fe__interview__questions__b26b39a422',
  'haizlin__fe__interview__997f122c4b',
  'haizlin__fe__interview__373fbab53d',
  'haizlin__fe__interview__d77d91c46f',
  'haizlin__fe__interview__cb7114fec0',
  'haizlin__fe__interview__cee9ec4fe6',
  'haizlin__fe__interview__6c0bf4cbcb',
  'haizlin__fe__interview__456e899f23',
  'haizlin__fe__interview__d6200a0162',
  'haizlin__fe__interview__99aa883073',
  'haizlin__fe__interview__67cb73dd14',
  'haizlin__fe__interview__b061a98438',
  'haizlin__fe__interview__232bd22298',
  'haizlin__fe__interview__785021175b',
  'haizlin__fe__interview__c49569f7c5',
  'haizlin__fe__interview__159e10de04',
  'poetries__fe__interview__questions__4c90d00711',
  'haizlin__fe__interview__9ad72e25ea',
  'poetries__fe__interview__questions__57b86d98be',

  // Forms candidate page migrated into forms, performance, JavaScript, Vue, React, TypeScript, and security docs.
  'haizlin__fe__interview__e9f6c9f6df',
  'poetries__fe__interview__questions__36751d50d3',
  'haizlin__fe__interview__d0e73c1373',
  'lgwebdream__fe__interview__16cedaf469',
  'lgwebdream__fe__interview__a4dcf1fce5',
  'haizlin__fe__interview__0c194b7502',
  'poetries__fe__interview__questions__68ae060684',
  'haizlin__fe__interview__4fabf5848b',
  'haizlin__fe__interview__a9581c73a7',
  'haizlin__fe__interview__c1d6b869c3',
  'haizlin__fe__interview__44e5268786',
  'haizlin__fe__interview__1ff10bced4',
  'haizlin__fe__interview__701a0cb127',
  'haizlin__fe__interview__34fd36d7dd',
  'lgwebdream__fe__interview__5f61d3c830',
  'haizlin__fe__interview__136928bd99',
  'haizlin__fe__interview__a58baa2eec',
  'lgwebdream__fe__interview__5caa621a29',
  'poetries__fe__interview__questions__b3f6cc633b',
  'haizlin__fe__interview__55f4531af8',
  'haizlin__fe__interview__ca0e33bd01',
  'haizlin__fe__interview__f61c087549',
  'haizlin__fe__interview__6c05211d49',
  'haizlin__fe__interview__024bfcd0a2',
  'haizlin__fe__interview__520fc09c44',
  'haizlin__fe__interview__892353f84d',
  'haizlin__fe__interview__d11545dcdd',
  'haizlin__fe__interview__6d07d9a80c',
  'haizlin__fe__interview__ab53a0ef87',
  'haizlin__fe__interview__c18f3e6832',
  'haizlin__fe__interview__bbbd035468',
  'haizlin__fe__interview__d0020195f8',
  'haizlin__fe__interview__1fcd548fe6',
  'lgwebdream__fe__interview__c751294005',
  'haizlin__fe__interview__a38d6c4228',
  'poetries__fe__interview__questions__f4c30a4dfd',
  'haizlin__fe__interview__c20cbf13d4',
  'poetries__fe__interview__questions__09014b018a',
  'haizlin__fe__interview__da410347e2',
  'haizlin__fe__interview__37cf7d1165',
  'lgwebdream__fe__interview__d7053da00c',
  'lgwebdream__fe__interview__a1738bf0fc',
  'haizlin__fe__interview__211b25698f',
  'poetries__fe__interview__questions__9304aadcec',
  'haizlin__fe__interview__68067d7d9f',
  'haizlin__fe__interview__8ff1c21f27',
  'lgwebdream__fe__interview__fe53ff6f32',
  'lgwebdream__fe__interview__bb1ab64534',
  'haizlin__fe__interview__d48dc1585a',
  'haizlin__fe__interview__cef0e48e98',
  'haizlin__fe__interview__64c3ae0f96',
  'haizlin__fe__interview__4be423f269',
  'lgwebdream__fe__interview__99f763feff',
  'haizlin__fe__interview__1879d20151',
  'haizlin__fe__interview__c3f5ef70f1',
  'haizlin__fe__interview__8e257038e7',
  'haizlin__fe__interview__6277ca02c0',
  'haizlin__fe__interview__c279cb30c9',
  'haizlin__fe__interview__7284255d5f',
  'haizlin__fe__interview__80b9dfb5bf',
  'haizlin__fe__interview__37bdbae24b',
  'haizlin__fe__interview__ea1286a529',
  'haizlin__fe__interview__3aa3631497',
  'haizlin__fe__interview__601ab5319e',
  'haizlin__fe__interview__e860edda51',
  'haizlin__fe__interview__140398a5a2',
  'haizlin__fe__interview__b2896ef856',
  'poetries__fe__interview__questions__831300dd7a',
  'haizlin__fe__interview__e1763dc355',
  'haizlin__fe__interview__94a1c82007',
  'haizlin__fe__interview__943d1196b2',
  'haizlin__fe__interview__ffbadaa95d',
  'haizlin__fe__interview__46e621470f',
  'haizlin__fe__interview__87cc6d5329',
  'haizlin__fe__interview__ea4a57d3a6',
  'haizlin__fe__interview__2d5c2bb277',
  'haizlin__fe__interview__ee001132fe',
  'haizlin__fe__interview__74359a1ecc',
  'haizlin__fe__interview__1f16ef4a0c',
  'haizlin__fe__interview__b58da948d4',
  'poetries__fe__interview__questions__1ba3dae2f1',
  'haizlin__fe__interview__bf83a3adeb',
  'haizlin__fe__interview__a0add8b613',
  'poetries__fe__interview__questions__b9f09929e7',
  'haizlin__fe__interview__251a41a8e0',
  'haizlin__fe__interview__456ee55b92',

  // Media/canvas/svg candidate page migrated into target media, browser, resource-loading, and security docs.
  'haizlin__fe__interview__86147b742a',
  'haizlin__fe__interview__a3bb3dac5d',
  'haizlin__fe__interview__71fb7afa55',
  'poetries__fe__interview__questions__7997f249bf',
  'haizlin__fe__interview__ba33bb3753',
  'haizlin__fe__interview__4e0b8c0290',
  'haizlin__fe__interview__b5548ee952',
  'haizlin__fe__interview__961ae4485f',
  'haizlin__fe__interview__36c3f93173',
  'haizlin__fe__interview__578b53de84',
  'poetries__fe__interview__questions__af4b38049f',
  'haizlin__fe__interview__06482cf23d',
  'haizlin__fe__interview__e917faa1ad',
  'haizlin__fe__interview__f620c5c051',
  'haizlin__fe__interview__c1550097de',
  'haizlin__fe__interview__50148278b4',
  'haizlin__fe__interview__fc946b3c4a',
  'haizlin__fe__interview__29511c43eb',
  'haizlin__fe__interview__1098a5baf5',
  'haizlin__fe__interview__0def9acef7',
  'haizlin__fe__interview__fee90d6934',
  'haizlin__fe__interview__25680cf6f5',
  'haizlin__fe__interview__c324ceb5b0',
  'haizlin__fe__interview__edb7cd6da9',
  'haizlin__fe__interview__9663993f8e',
  'haizlin__fe__interview__a8e61a3e35',
  'haizlin__fe__interview__9ee578200a',
  'poetries__fe__interview__questions__0511b6a969',
  'poetries__fe__interview__questions__09c0591d1a',
  'haizlin__fe__interview__df05909f45',
  'haizlin__fe__interview__fbe37da907',
  'haizlin__fe__interview__5f3c4d87fa',
  'haizlin__fe__interview__645254e9d8',
  'haizlin__fe__interview__9f5707c35e',
  'haizlin__fe__interview__a86a1ba5f3',
  'haizlin__fe__interview__df04118790',
  'haizlin__fe__interview__889b37e84a',
  'haizlin__fe__interview__63504094e4',
  'haizlin__fe__interview__05adcf5d49',
  'haizlin__fe__interview__595f4528d6',
  'haizlin__fe__interview__c44caf07ca',
  'haizlin__fe__interview__52139bbe43',
  'haizlin__fe__interview__6d6de27eae',
  'haizlin__fe__interview__72f867c39e',
  'haizlin__fe__interview__c878387404',
  'haizlin__fe__interview__53a79fa550',
  'haizlin__fe__interview__9e870185bc',
  'haizlin__fe__interview__a9c5d27e40',
  'haizlin__fe__interview__2aea662e61',
  'haizlin__fe__interview__f002d39e97',
  'haizlin__fe__interview__5b970b6719',
  'haizlin__fe__interview__252f87f0a0',
  'haizlin__fe__interview__a3119c9329',
  'haizlin__fe__interview__a791930b06',
  'haizlin__fe__interview__d51724a6a0',
  'haizlin__fe__interview__82945e8082',
  'haizlin__fe__interview__7e3effa09b',
  'haizlin__fe__interview__ec98040440',
  'haizlin__fe__interview__6f230c3e62',
  'haizlin__fe__interview__ae7e744c0c',
  'haizlin__fe__interview__a6c7ee7b27',
  'haizlin__fe__interview__884168e8ff',
  'haizlin__fe__interview__8140ffdd4e',
  'haizlin__fe__interview__aa74217b41',
  'haizlin__fe__interview__11ab5cc771',
  'haizlin__fe__interview__a255fbc46c',
  'haizlin__fe__interview__cb43d0fff6',
  'haizlin__fe__interview__325b0b6f4a',
  'haizlin__fe__interview__2887085649',
  'haizlin__fe__interview__fb44d1e750',
  'haizlin__fe__interview__8a1a5f6b8c',
  'haizlin__fe__interview__ebe0e6a4bf',
  'haizlin__fe__interview__f29947d54f',
  'haizlin__fe__interview__3e0e51c632',
  'haizlin__fe__interview__574dc33fe8',
  'haizlin__fe__interview__d89eba0fbf',
  'haizlin__fe__interview__179782cc33',
  'haizlin__fe__interview__5177b54dee',
  'haizlin__fe__interview__7922aded76',
  'haizlin__fe__interview__6553d06daa',
  'haizlin__fe__interview__cefa202065',
  'haizlin__fe__interview__80911d3503',
  'haizlin__fe__interview__ba197c24f2',
  'haizlin__fe__interview__fe1eadb683',
  'haizlin__fe__interview__213eccaa65',
  'haizlin__fe__interview__c1005722a4',
  'haizlin__fe__interview__b0d9bde5d4',
  'haizlin__fe__interview__14fea81222',
  'haizlin__fe__interview__308ed3f813',
  'haizlin__fe__interview__13d0969772',
  'haizlin__fe__interview__27e4c58341',
  'haizlin__fe__interview__402487f9d5',
  'haizlin__fe__interview__026a0cd253',
  'haizlin__fe__interview__f63f3c656d',
  'haizlin__fe__interview__8792b1430c',
  'haizlin__fe__interview__be952dd697',
  'haizlin__fe__interview__8e1db33b53',
  'haizlin__fe__interview__95ea7d6bf4',

  // Mobile-H5 candidate page migrated into mobile, PWA, hybrid, and existing JS/HTML concept docs.
  'haizlin__fe__interview__976df68a8e',
  'haizlin__fe__interview__84cc9a6941',
  'haizlin__fe__interview__dc6fc469b6',
  'haizlin__fe__interview__8a7ab33768',
  'poetries__fe__interview__questions__4d45a15f99',
  'poetries__fe__interview__questions__78206c028f',
  'haizlin__fe__interview__4fbfe16a47',
  'haizlin__fe__interview__a9ace00d38',
  'haizlin__fe__interview__3a016843b8',
  'haizlin__fe__interview__4a41f96038',
  'haizlin__fe__interview__409a14a2e4',
  'haizlin__fe__interview__4de95bce19',
  'haizlin__fe__interview__88e92cbcd3',
  'haizlin__fe__interview__276d1cc4a9',
  'haizlin__fe__interview__c55dae756d',
  'haizlin__fe__interview__35cf2c5b54',
  'lgwebdream__fe__interview__90b2b1a2bb',
  'haizlin__fe__interview__3a515fc58c',
  'haizlin__fe__interview__c5701a9918',
  'haizlin__fe__interview__3bfef52a44',
  'lgwebdream__fe__interview__f72e93e4ac',
  'haizlin__fe__interview__0047993b60',
  'lgwebdream__fe__interview__b2a39ec69f',
  'lgwebdream__fe__interview__a38328955a',
  'haizlin__fe__interview__30d1fb6d02',
  'haizlin__fe__interview__e6f10f692e',
  'haizlin__fe__interview__6aa6d07fbd',
  'haizlin__fe__interview__3d8c7ebc83',
  'haizlin__fe__interview__466affe860',
  'haizlin__fe__interview__91bb2d3b54',
  'haizlin__fe__interview__c700a2ab79',
  'haizlin__fe__interview__ef88c849fd',
  'haizlin__fe__interview__80969f286f',
  'haizlin__fe__interview__eba77ce1f8',
  'haizlin__fe__interview__5de9a901ce',
  'haizlin__fe__interview__d71eaf4666',
  'haizlin__fe__interview__a74531de6f',
  'haizlin__fe__interview__c44d0f298e',
  'haizlin__fe__interview__2494dc05e5',
  'haizlin__fe__interview__26f0d7354f',
  'haizlin__fe__interview__b2974d15e2',
  'haizlin__fe__interview__5a499fc14d',
  'haizlin__fe__interview__e58d43709e',
  'haizlin__fe__interview__0e8c34d286',
  'haizlin__fe__interview__a624a4238f',
  'haizlin__fe__interview__98c345d20c',
  'haizlin__fe__interview__40c6179718',
  'haizlin__fe__interview__7efdfd53ed',
  'haizlin__fe__interview__dbccebc8f1',
  'haizlin__fe__interview__f1c1fff72e',
  'poetries__fe__interview__questions__efa8a775b4',
  'haizlin__fe__interview__250e8258e7',
  'haizlin__fe__interview__14b01c6481',
  'haizlin__fe__interview__176f78ad5a',
  'haizlin__fe__interview__5157c7b573',
  'haizlin__fe__interview__8b58ab8b20',
  'haizlin__fe__interview__4189e2b679',
  'haizlin__fe__interview__b42109ee25',
  'haizlin__fe__interview__9edfc92a39',
  'haizlin__fe__interview__f78540eed2',
  'haizlin__fe__interview__181ad2a069',
  'haizlin__fe__interview__166f46d064',
  'haizlin__fe__interview__24d45a71ec',
  'haizlin__fe__interview__68c4d54e2d',
  'poetries__fe__interview__questions__babd88e629',
  'haizlin__fe__interview__4d11fb9c90',
  'poetries__fe__interview__questions__8180375fca',
  'poetries__fe__interview__questions__ebb0953dc3',
  'haizlin__fe__interview__907e8b81a9',
  'haizlin__fe__interview__5f97892c21',
  'poetries__fe__interview__questions__5a35ff8b45',

  // Other candidate page migrated into JS events, network Ajax, React events, performance, CSS, and HTML concept docs.
  'poetries__fe__interview__questions__b51dd8762e',
  'poetries__fe__interview__questions__7f42ff326f',
  'poetries__fe__interview__questions__ecbf544c11',
  'lgwebdream__fe__interview__23d46f31bc',
  'poetries__fe__interview__questions__4e5566264e',
  'poetries__fe__interview__questions__f7510df0d5',
  'poetries__fe__interview__questions__c562a81df3',
  'haizlin__fe__interview__1e59c97e4f',
  'haizlin__fe__interview__d812c3810a',
  'haizlin__fe__interview__a5622ee041',
  'poetries__fe__interview__questions__86b2d138db',
  'haizlin__fe__interview__ad8f45b26e',
  'haizlin__fe__interview__c99be49bcd',
  'haizlin__fe__interview__c94c15fd06',
  'poetries__fe__interview__questions__8a6dfd3721',
  'haizlin__fe__interview__083a0237fb',
  'poetries__fe__interview__questions__38b56a4c36',
  'poetries__fe__interview__questions__12eab562ff',
  'haizlin__fe__interview__b159960f82',
  'poetries__fe__interview__questions__e9bc31ed66',
  'poetries__fe__interview__questions__aead759a12',
  'poetries__fe__interview__questions__6a1585f90f',
  'haizlin__fe__interview__8210a9ab6b',
  'poetries__fe__interview__questions__55803d04aa',
  'haizlin__fe__interview__2ffb7f2cf8',
  'lgwebdream__fe__interview__90991a1e0b',
  'lgwebdream__fe__interview__db0bd3e460',
  'lgwebdream__fe__interview__4cd4dc23dc',
  'lgwebdream__fe__interview__222e21269e',
  'poetries__fe__interview__questions__2f7a3304a5',
  'poetries__fe__interview__questions__458bf4163f',
  'lgwebdream__fe__interview__6b224f0e40',
  'lgwebdream__fe__interview__9fa1d69224',
  'lgwebdream__fe__interview__7dc6d54b6c',
  'poetries__fe__interview__questions__f05fc9b271',
  'haizlin__fe__interview__4fa82bb480',
  'haizlin__fe__interview__edaa4aabd7',
  'haizlin__fe__interview__0d857474de',
  'haizlin__fe__interview__98903eb54f',
  'poetries__fe__interview__questions__557895b99d',
  'poetries__fe__interview__questions__e105254e08',
  'lgwebdream__fe__interview__82c20e7880',
  'lgwebdream__fe__interview__31823309ac',
  'poetries__fe__interview__questions__bf1892292a',
  'haizlin__fe__interview__795b15adc3',
  'poetries__fe__interview__questions__ef2f20524a',
  'haizlin__fe__interview__1d2f83796c',
  'haizlin__fe__interview__0cf6c39219',
  'haizlin__fe__interview__8a23876936',
  'haizlin__fe__interview__99e83abc87',
  'haizlin__fe__interview__900656c038',
  'haizlin__fe__interview__426a91b32f',
  'poetries__fe__interview__questions__3d827e4e9e',
  'poetries__fe__interview__questions__a7476d300b',
  'poetries__fe__interview__questions__0be92dec57',
  'poetries__fe__interview__questions__612a83d3f1',
  'poetries__fe__interview__questions__1e329bbfb7',
  'haizlin__fe__interview__4c7f82b928',
  'poetries__fe__interview__questions__813324550a',
  'poetries__fe__interview__questions__e9ffa78349',
  'poetries__fe__interview__questions__dfc37762f0',
  'haizlin__fe__interview__11c610bcf4',
  'poetries__fe__interview__questions__382da50b29'
])

const groups = [
  {
    id: 'document-structure',
    title: '文档结构',
    description: 'DOCTYPE、html/body/head、meta、页面结构和基础元素。',
    keywords: ['doctype', '<html', 'html,body', 'body{', 'head', 'meta', 'title', '文档', '页面结构', 'h标签', 'w3c', '标准模式', '怪异模式']
  },
  {
    id: 'links-navigation',
    title: '链接、导航与 iframe',
    description: 'a 标签、href、target、download、iframe、页面跳转和导航行为。',
    keywords: ['a标签', 'href', 'target', 'download', 'iframe', '跳转', '导航', '锚点', 'javascript:void']
  },
  {
    id: 'forms',
    title: '表单与输入控件',
    description: 'form、input、button、select、textarea、校验、提交和自动填充。',
    keywords: ['form', 'input', 'button', 'select', 'textarea', 'checkbox', 'radio', '表单', '提交', '校验', 'placeholder', 'autocomplete']
  },
  {
    id: 'media-canvas-svg',
    title: '媒体、Canvas 与 SVG',
    description: 'img、picture、audio、video、canvas、svg 和图像资源。',
    keywords: ['img', 'image', '图片', 'picture', 'srcset', 'audio', 'video', 'canvas', 'svg', 'webgl', '媒体', '图像']
  },
  {
    id: 'storage-offline',
    title: '存储与离线能力',
    description: 'localStorage、sessionStorage、Cookie、IndexedDB、离线缓存和文件 API。',
    keywords: ['storage', 'localstorage', 'sessionstorage', 'cookie', 'indexeddb', '离线', '缓存', 'file', 'blob', 'base64', 'data url']
  },
  {
    id: 'mobile-h5',
    title: '移动端 H5',
    description: 'viewport、移动端适配、软键盘、横屏、H5 与 App/小程序交互。',
    keywords: ['viewport', '移动', 'h5', '手机', '小程序', 'app', '软键盘', '横屏', 'ios', 'android', '适配']
  },
  {
    id: 'performance-loading',
    title: '加载与性能',
    description: '资源加载、首屏、白屏、懒加载、预加载、Web Worker 和性能优化。',
    keywords: ['性能', '优化', '白屏', '首屏', '懒加载', '预加载', 'preload', 'prefetch', 'script', 'defer', 'async', 'worker', '加载', 'gzip']
  },
  {
    id: 'compatibility-security',
    title: '兼容性与安全',
    description: '浏览器兼容、XSS、CSP、sandbox、跨域和旧环境问题。',
    keywords: ['兼容', 'ie', '浏览器', 'xss', 'csp', '安全', 'sandbox', '跨域', 'cors', '同源', 'flash']
  },
  {
    id: 'other',
    title: '其它 HTML 候选题',
    description: '暂时无法稳定归类，后续人工审查后再迁移到更具体主题。',
    keywords: []
  }
]

const rows = readFileSync(inputPath, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line))

const migratedCandidateGroupIds = new Set([
  // These generated buckets were audited as broad false-positive candidate groups.
  // Their useful topics were moved into formal docs across JS, TS, CSS, browser,
  // build tools, performance, network, React, and HTML document-structure menus.
  'performance-loading',
  'compatibility-security'
])

const candidateHtmlQuestions = rows
  .filter((row) => row.category === 'html')
  .filter((row) => !handledQuestionIds.has(row.id))
  .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'))

const grouped = new Map(groups.map((group) => [group.id, []]))
const htmlQuestions = []

for (const question of candidateHtmlQuestions) {
  const group = classify(question)
  if (migratedCandidateGroupIds.has(group.id)) {
    continue
  }

  htmlQuestions.push(question)
  grouped.get(group.id).push(question)
}

mkdirSync(outputDir, { recursive: true })
rmSync(path.join(outputDir, 'semantics-accessibility.md'), { force: true })

for (const group of groups) {
  const questions = grouped.get(group.id)
  const filePath = path.join(outputDir, `${group.id}.md`)
  if (questions.length === 0) {
    rmSync(filePath, { force: true })
    continue
  }
  writeFileSync(filePath, renderGroupPage(group, questions), 'utf8')
}

writeFileSync(path.join(outputDir, 'index.md'), renderIndexPage(), 'utf8')

const fullAnswerCount = htmlQuestions.filter((question) => !isLinkOnly(question)).length
const linkOnlyAnswerCount = htmlQuestions.length - fullAnswerCount
const outdatedCount = htmlQuestions.filter((question) => question.isOutdated).length

console.log(`synced ${htmlQuestions.length} html questions`)
console.log(`full answers: ${fullAnswerCount}`)
console.log(`link-only answers: ${linkOnlyAnswerCount}`)
console.log(`outdated: ${outdatedCount}`)
for (const group of groups) {
  console.log(`${group.id}: ${grouped.get(group.id).length}`)
}

function classify(question) {
  const text = `${question.title}\n${question.answer}\n${question.tags.join(' ')}`.toLowerCase()
  const groupById = (id) => groups.find((group) => group.id === id)

  if (text.includes('事件') || text.includes('dispatchevent') || text.includes('currenttarget')) {
    return groupById('other')
  }

  if (text.includes('写出输出值并解释为什么')) {
    return groupById('other')
  }

  if (text.includes('ajax')) {
    return groupById('other')
  }

  if (text.includes('同源') || text.includes('content-security-policy') || text.includes('polyfill') || text.includes('ie的事件')) {
    return groupById('compatibility-security')
  }

  if (text.includes('fouc') || text.includes('输入 url') || text.includes('输入 url 到页面加载') || text.includes('js放在html的<body>和<head>')) {
    return groupById('performance-loading')
  }

  if (text.includes('<a>标签') || text.includes('target属性')) {
    return groupById('links-navigation')
  }

  if (text.includes('alt和title')) {
    return groupById('media-canvas-svg')
  }

  if (text.includes('css3新增伪类') || text.includes('css中哪个属性会影响dom读取文档流的顺序')) {
    return groupById('other')
  }

  if (text.includes('web 前端开发的注意事项')) {
    return groupById('mobile-h5')
  }

  if (text.includes('domcontentloaded') || text.includes('css加载') || text.includes('css 加载')) {
    return groupById('performance-loading')
  }

  return groups.find((group) => {
    if (group.id === 'other') return false
    return group.keywords.some((keyword) => text.includes(keyword.toLowerCase()))
  }) || groups.at(-1)
}

function renderIndexPage() {
  const byRepo = countBy(htmlQuestions, (question) => question.sourceRepo)
  const nonEmptyGroups = groups.filter((group) => grouped.get(group.id).length > 0)
  const byGroup = Object.fromEntries(groups.map((group) => [group.title, grouped.get(group.id).length]))
  const byAnswerType = {
    '全文答案': htmlQuestions.filter((question) => !isLinkOnly(question)).length,
    '仅来源链接': htmlQuestions.filter(isLinkOnly).length
  }

  return [
    '# HTML 候选题库',
    '',
    '来源：`.scratch/questions.jsonl` 中 `category === "html"` 的记录。',
    '',
    '这个目录用于承接外部题库中的 HTML 候选问题。内容先完整保留，后续再按价值、时效性和可验证性拆入精修知识点页。',
    '',
    '## 数量审计',
    '',
    `- JSONL 总题数：${rows.length}`,
    `- HTML 候选题数：${htmlQuestions.length}`,
    `- 全文答案：${byAnswerType['全文答案']}`,
    `- 仅来源链接答案：${byAnswerType['仅来源链接']}`,
    `- 标记过时：${htmlQuestions.filter((question) => question.isOutdated).length}`,
    '',
    '### 按主题分组',
    '',
    '| 主题 | 数量 | 页面 |',
    '| --- | ---: | --- |',
    ...nonEmptyGroups.map((group) => `| ${group.title} | ${byGroup[group.title]} | [查看](/html/question-bank/${group.id}) |`),
    '',
    '### 按来源仓库',
    '',
    '| 来源 | 数量 |',
    '| --- | ---: |',
    ...Object.entries(byRepo).map(([repo, count]) => `| ${repo} | ${count} |`),
    '',
    '## 使用规则',
    '',
    '- 这里是候选题库，不是最终答案页。',
    '- `仅来源链接答案` 需要打开 `sourceUrl` 核对 issue 或原文。',
    '- `isOutdated: true` 的题默认不进入精修页，除非用于历史对比。',
    '- 精修时优先迁移高频、可验证、能补 demo 的问题。',
    ''
  ].join('\n')
}

function renderGroupPage(group, questions) {
  const byRepo = countBy(questions, (question) => question.sourceRepo)
  const fullAnswerCount = questions.filter((question) => !isLinkOnly(question)).length
  const linkOnlyAnswerCount = questions.length - fullAnswerCount
  const outdatedCount = questions.filter((question) => question.isOutdated).length

  return [
    `# ${group.title}`,
    '',
    group.description,
    '',
    '## 数量审计',
    '',
    `- 本组题数：${questions.length}`,
    `- 全文答案：${fullAnswerCount}`,
    `- 仅来源链接答案：${linkOnlyAnswerCount}`,
    `- 标记过时：${outdatedCount}`,
    '',
    '### 来源分布',
    '',
    '| 来源 | 数量 |',
    '| --- | ---: |',
    ...Object.entries(byRepo).map(([repo, count]) => `| ${repo} | ${count} |`),
    '',
    '## 问题',
    '',
    ...questions.flatMap((question, index) => renderQuestion(question, index + 1)),
    ''
  ].join('\n')
}

function renderQuestion(question, index) {
  return [
    `### ${index}. ${escapeHeading(question.title)}`,
    '',
    `- 来源：${question.sourceRepo}`,
    `- 路径：\`${question.sourcePath}\``,
    `- 链接：[sourceUrl](${question.sourceUrl})`,
    `- 答案类型：${isLinkOnly(question) ? '仅来源链接' : '全文答案'}`,
    `- 是否过时：${question.isOutdated ? '是' : '否'}`,
    `- 标签：${question.tags.length > 0 ? question.tags.map((tag) => `\`${tag}\``).join(' ') : '无'}`,
    '',
    '#### 答案',
    '',
    normalizeAnswer(question.answer),
    ''
  ]
}

function isLinkOnly(question) {
  return question.answer.startsWith('答案见原仓库链接：')
}

function countBy(items, getKey) {
  return Object.fromEntries(
    Object.entries(Object.groupBy(items, getKey))
      .map(([key, value]) => [key, value.length])
      .sort((a, b) => b[1] - a[1])
  )
}

function escapeHeading(value) {
  return escapeMarkdownHtml(value)
    .replace(/\n/g, ' ')
    .replace(/#/g, '')
    .trim()
}

function normalizeAnswer(value) {
  return `<pre v-pre class="question-bank-answer"><code>${escapeHtml(value.trim() || '暂无答案。')}</code></pre>`
}

function escapeMarkdownHtml(value) {
  // 候选题来自外部仓库，常包含 <meta>、<script> 等片段。
  // VitePress 会把 Markdown 编译成 Vue 模板；未转义的尖括号可能触发模板解析错误。
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
