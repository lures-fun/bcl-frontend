import BCLch_icon from '@/assets/icon/BCLch_icon.png';
import bellIcon from '@/assets/icon/bell_icon.png';
import historyIcon from '@/assets/icon/history_icon.png';
import personIcon from '@/assets/icon/person_icon.png';
import shopIcon from '@/assets/icon/shop_icon.png';
import bronzeMedal from '@/assets/icon/bronze-medal.svg';
import goldMedal from '@/assets/icon/gold-medal.svg';
import silverMedal from '@/assets/icon/silver-medal.svg';

export const LINKS: string[] = ['マイページ', 'SHOP', 'BCL ch', 'History/Library'];
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const S3_TYPES = {
  DAO_TALK: 'post',
  FISHING_RESULT_APPLY: 'fishing-result%2Fapply',
  FISHING_RESULT_NFT: 'fishing-result%2Fnft',
  FISHING_RESULT_SIZE_CONFIRMATION: 'fishing-result%2Fsize-confirmation',
};

export const PREFECTURES = [
  { value: '01', name: '北海道', name_en: 'HOKKAIDO' },
  { value: '02', name: '青森県', name_en: 'AOMORI' },
  { value: '03', name: '岩手県', name_en: 'IWATE' },
  { value: '04', name: '宮城県', name_en: 'MIYAGI' },
  { value: '05', name: '秋田県', name_en: 'AKITA' },
  { value: '06', name: '山形県', name_en: 'YAMAGATA' },
  { value: '07', name: '福島県', name_en: 'FUKUSHIMA' },
  { value: '08', name: '茨城県', name_en: 'IBARAKI' },
  { value: '09', name: '栃木県', name_en: 'TOCHIGI' },
  { value: '10', name: '群馬県', name_en: 'GUNNMA' },
  { value: '11', name: '埼玉県', name_en: 'SAITAMA' },
  { value: '12', name: '千葉県', name_en: 'CHIBA' },
  { value: '13', name: '東京都', name_en: 'TOKYO' },
  { value: '14', name: '神奈川県', name_en: 'KANAGAWA' },
  { value: '15', name: '新潟県', name_en: 'NIIGATA' },
  { value: '16', name: '富山県', name_en: 'TOYAMA' },
  { value: '17', name: '石川県', name_en: 'ISHIKAWA' },
  { value: '18', name: '福井県', name_en: 'FUKUI' },
  { value: '19', name: '山梨県', name_en: 'YAMANASHI' },
  { value: '20', name: '長野県', name_en: 'NAGANO' },
  { value: '21', name: '岐阜県', name_en: 'GIFU' },
  { value: '22', name: '静岡県', name_en: 'SHIZUOKA' },
  { value: '23', name: '愛知県', name_en: 'AICHI' },
  { value: '24', name: '三重県', name_en: 'MIE' },
  { value: '25', name: '滋賀県', name_en: 'SHIGA' },
  { value: '26', name: '京都府', name_en: 'KYOTO' },
  { value: '27', name: '大阪府', name_en: 'OSAKA' },
  { value: '28', name: '兵庫県', name_en: 'HYOUGO' },
  { value: '29', name: '奈良県', name_en: 'NARA' },
  { value: '30', name: '和歌山県', name_en: 'WAKAYAMA' },
  { value: '31', name: '鳥取県', name_en: 'TOTTORI' },
  { value: '32', name: '島根県', name_en: 'SHIMANE' },
  { value: '33', name: '岡山県', name_en: 'OKAYAMA' },
  { value: '34', name: '広島県', name_en: 'HIROSHIMA' },
  { value: '35', name: '山口県', name_en: 'YAMAGUCHI' },
  { value: '36', name: '徳島県', name_en: 'TOKUSHIMA' },
  { value: '37', name: '香川県', name_en: 'KAGAWA' },
  { value: '38', name: '愛媛県', name_en: 'EHIME' },
  { value: '39', name: '高知県', name_en: 'KOUCHI' },
  { value: '40', name: '福岡県', name_en: 'FUKUOKA' },
  { value: '41', name: '佐賀県', name_en: 'SAGA' },
  { value: '42', name: '長崎県', name_en: 'NAGASAKI' },
  { value: '43', name: '熊本県', name_en: 'KUMAMOTO' },
  { value: '44', name: '大分県', name_en: 'OOITA' },
  { value: '45', name: '宮崎県', name_en: 'MIYAZAKI' },
  { value: '46', name: '鹿児島県', name_en: 'KAGOSHIMA' },
  { value: '47', name: '沖縄県', name_en: 'OKINAWA' },
];
export enum COLLABORATION_MAKER {
  W3_CRANKBAIT = 'W3_CRANKBAIT',
  DRAFTWAKER = 'DRAFT_WAKER',
  SATO_GYOKYO = 'SATO_GYOKYO',
  TAPPEI_BNSP = 'TAPPEI_BNSP',
  LC_MTO15 = 'LC_MTO15',
  SATAN_SHIMADA_SALON = 'SATAN_SHIMADA_SALON',
  HMKL = 'HMKL',
  N_SHAD = 'N_SHAD',
}

export const FISHTYPES = [
  {
    id: '1',
    display: 'ラージマウスバス',
  },
  {
    id: '2',
    display: 'スモールマウスバス',
  },
];

export enum FIELDTYPES {
  ASHINOKO = '芦ノ湖',
}

export enum LURETYPES {
  W3_CRANKBAIT = 'W3_CRANKBAIT',
  DRAFTWAKER = 'DRAFT_WAKER',
  LC_MTO15 = 'LC_MTO15',
  VOLBEAT70F = 'VOLBEAT70F',
  VOLBEAT70S = 'VOLBEAT70S',
  DOT_SIX = 'DOT_SIX',
  BOXER = 'BOXER',
  HMKL_SUPER_JORDAN_68 = 'HMKL_SUPER_JORDAN_68',
  TAPPEI_BNSP = 'TAPPEI_BNSP',
  SCREW_WAKATARO = 'SCREW_WAKATARO',
  RANKAKU_80 = 'RANKAKU_80',
  HYOUSOU_BAKA_ICHIDAI = 'HYOUSOU_BAKA_ICHIDAI',
  N_SHAD = 'N_SHAD',
  BALAM_300_YUKI = 'BALAM_300_YUKI',
  VARIANT_255_YUKI = 'VARIANT_255_YUKI',
  COIKE = 'COIKE',
  MOSAIC_LURE = 'MOSAIC_LURE',
}

export const LURE_COLOR = {
  NOTHING: '00',
  LC_MTO15: {
    MS_MOEBI_SHAD: '01',
    MS_KOHAKU_SHAD: '02',
  },
  VOLBEAT70F: {
    MOEBI_CLAW: '01',
  },
  VOLBEAT70S: {
    APPLE_RED_CLAW: '01',
  },
  DOT_SIX: {
    KOHAKU_CLAW: '01',
    SAKURA_SHAD: '02',
  },
  SUPER_JORDAN_68: {
    BCL_SAKURA: '01',
    BCL_KIZAKURA: '02',
  },
  COIKE: {
    // #288 スモーカーBG-F
    SMOKER_BG_F: '01',
    // #289 クリアオレンジPGG-F
    CLEAR_ORANGE_PGG_F: '02',
    // #290 SPG
    SPG: '03',
    // #291 エッジシュリンプ
    EDGE_SHRIMP: '04',
  },
};

export enum LANGUAGE {
  DEFAULT = 'Language',
  JA = 'ja',
  EN = 'en',
}

export const lureColorNames = {
  W3_CRANKBAIT: [
    'USクローダッド',
    'USクローダッドファントム',
    'アップルレッドクロー',
    'アップルレッドクローファントム',
    'ファントムグリーンクロー',
    'ファントムブラウンクロー',
    'モエビクロー',
    'ウォーターメロンレッドクロー',
    'ホワイトクローダッド',
    'ホットタイガークロー',
  ],
  DRAFTWAKER: [
    'ブラック&ピンクヒップ',
    'マットボーン',
    'ピンクバックオイカワ',
    '相模湖忍者シャッド',
    'ブルーバックチャート',
    'ピンクスキン240',
    'ウエマシャーク',
    'SSKマットクリア',
    '09 BLACK',
    'ハーフオイカワ',
  ],
};

export enum SERIALCODES {
  NOTHING = '000',
}

export enum COMMENT_TYPE {
  FISHING_RESULT = 1,
  POST = 2,
}

export enum NOTIFICATION_TYPE {
  RECEIVE_COMMENT = 1,
  RECEIVE_BBT = 2,
  REGISTER_LURE = 3,
  APPROVE_FISHING_RESULT = 4,
  RECEIVE_TROPHY = 5,
  FOLLOWED = 6,
  LIKE = 7,
}

export enum NOTIFICATION_STATUS {
  READY = 1,
  PROCESSING = 2,
  FIX = 3,
  ERROR = 9,
}

export const paths = {
  login: '/',
  home: '/home',
  lureCreate: '/lures',
  lureEdit: '/lures/:lureId',
  lureDetail: '/lures/:lureId/detail',
  lurePurchase: '/lures/purchase/',
  gallery: '/gallery/:userName?',
  tackleBox: '/tackle-box/:userName?',
  tackleBoxList: '/tackle-box-list/:lureType/:userName?',
  myPage: '/my-page',
  anglerDetail: '/my-page/angler-detail',
  fishingResultCreate: '/apply',
  fishingResultDetail: '/fishing-result/:userName/:resultId',
  inquiry: '/inquiry',
  inquirySent: '/inquiry/sent',
  inquiryConfirm: '/inquiry/confirm',
  timeline: '/timeline/:timelineType',
  following: '/timeline/:timelineType/following',
  trophies: '/trophies/:trophyId',
  titleLists: '/title-lists',
  fieldTitleList: '/title-lists/field',
  lureTitleList: '/title-lists/lure',
  rankings: '/rankings',
  lureRankings: '/lure-rankings',
  lureColorRankings: '/lure-rankings/lure-color',
  fieldRankings: '/field-rankings/:field',
  fishingResultComment: '/fishing-result/:userName/:fishingResultId/comment',
  fishingResultLikedUsers: '/fishing-result/:userName/:resultId/likes',
  snsPost: '/sns',
  snsEdit: '/sns/:postId/edit',
  followPage: '/gallery/:userName/follows',
  snsDetail: '/sns/:userName/:postId',
  snsPostComment: '/sns/:postId/comment',
  snsPostLikedUsers: '/sns/:postId/likes',
  userTimelineSearch: '/search',
  news: '/news',
  goodsBox: '/goods-box/:userName',
  goodsDetail: '/goods-detail/:goodsId',
  hallOfFame: '/hall-of-fame/:userName',
  shopifyRedirect: '/shopify-redirect',
  notifications: '/notifications',
};

export const pathsCreator = {
  lureEdit: (lureId: string) => `/lures/${lureId}`,
  lureDetail: (lureId: string) => `/lures/${lureId}/detail`,
  gallery: (userName?: string) => (userName ? `/gallery/${userName}` : '/gallery'),
  tackleBox: (userName?: string) => (userName ? `/tackle-box/${userName}` : '/tackle-box'),
  tackleBoxList: (lureType: string, userName?: string) =>
    userName ? `/tackle-box-list/${lureType}/${userName}` : `/tackle-box-list/${lureType}`,
  fishingResultDetail: (userName: string, resultId: string) =>
    `/fishing-result/${userName}/${resultId}`,
  trophies: (trophyId: string) => `/trophies/${trophyId}`,
  fishingResultComment: (userName: string, fishingResultId: string) =>
    `/fishing-result/${userName}/${fishingResultId}/comment`,
  // snsPost: (userName: string) => `/gallery/${userName}/sns`,
  snsEdit: (postId: string) => `/sns/post/${postId}/edit/`,
  followPage: (userName: string) => `/gallery/${userName}/follows`,
  followeePage: (userName: string) => `/gallery/${userName}/follows?tab=followee`,
  fishingResultLikedUsers: (userName: string, resultId: string) =>
    `/fishing-result/${userName}/${resultId}/likes`,
  snsDetail: (userName: string, postId: string, displayComment?: boolean) =>
    `/sns/${userName}/${postId}?displayComment=${displayComment}`,
  snsPostComment: (postId: string) => `/sns/post/${postId}/comment`,
  snsPostLikedUsers: (postId: string) => `/sns/post/${postId}/likes`,
  timeline: () => `/timeline`,
  following: () => `/timeline/following`,
  goodsBox: (userName: string) => `/goods-box/${userName}`,
  lureRankings: () => `/lure-rankings`,
  lureColorRankings: () => `/lure-rankings/lure-color`,
  fieldRankings: (fieldId: string) => `/field-rankings/${fieldId}`,
  goodsDetail: (goodsId: string) => `/goods-detail/${goodsId}`,
  hallOfFame: (userName: string) => `/hall-of-fame/${userName}`,
};
export const HEADER_MENU = [
  {
    iconSrc: personIcon,
    text: 'マイページ',
    link: paths.myPage,
  },
  {
    iconSrc: shopIcon,
    text: 'SHOP',
    link: 'https://blockchainlures.myshopify.com/',
    isExternal: true,
  },
  {
    iconSrc: BCLch_icon,
    text: 'Youtube',
    link: 'https://www.youtube.com/@blockchainlures/streams',
    isExternal: true,
  },
  {
    iconSrc: historyIcon,
    text: 'History/Library',
    link: paths.titleLists,
  },
  {
    iconSrc: bellIcon,
    text: 'News',
    link: paths.news,
  },
];

export const TIMELINE_TYPES = {
  fishingResults: '1',
  daoResults: '2',
};

export const GOOD_TYPES = {
  fishingResults: '1',
  daoResults: '2',
};

export const TIMELINE_TABS = {
  new: 0,
  follower: 1,
};

export const RANKING_TABS = {
  bigFish: 0,
  fishingCount: 1,
};

export const RANKING_TYPES = {
  bigFish: 'bigFish',
  fishingCount: 'fishingCount',
};

export const TOPRANKING_TYPES = {
  lure: 'lure',
  field: 'field',
};

export const SEARCH_TABS = {
  users: 0,
  fishing_results: 1,
  dao_talks: 2,
};

export const SEARCH_TYPES = {
  users: 'users',
  fishing_results: 'fishing-results',
  dao_talks: 'dao-talks',
};

export const TROPHIES = [
  {
    id: 1,
    name: 'gold',
    icon: goldMedal.src,
  },
  {
    id: 2,
    name: 'silver',
    icon: silverMedal.src,
  },
  {
    id: 3,
    name: 'bronze',
    icon: bronzeMedal.src,
  },
];

export const displayLureNames = (lureType: string, color?: string) => {
  if (lureType === LURETYPES.W3_CRANKBAIT) return 'W3';
  else if (lureType === LURETYPES.DRAFTWAKER) return 'ドラフトウェイカー';
  else if (lureType === LURETYPES.LC_MTO15 && color === LURE_COLOR.LC_MTO15.MS_MOEBI_SHAD)
    return 'LC MTO1.5（MSモエビシャッド）';
  else if (lureType === LURETYPES.LC_MTO15 && color === LURE_COLOR.LC_MTO15.MS_KOHAKU_SHAD)
    return 'LC MTO1.5（MSコハクシャッド）';
  else if (lureType === LURETYPES.VOLBEAT70F && color === LURE_COLOR.VOLBEAT70F.MOEBI_CLAW)
    return 'VOLBEAT70F（モエビクロー）';
  else if (lureType === LURETYPES.VOLBEAT70S && color === LURE_COLOR.VOLBEAT70S.APPLE_RED_CLAW)
    return 'VOLBEAT70S（アップルレッドクロー）';
  else if (lureType === LURETYPES.DOT_SIX && color === LURE_COLOR.DOT_SIX.KOHAKU_CLAW)
    return 'Dot SIX（コハククロー）';
  else if (lureType === LURETYPES.DOT_SIX && color === LURE_COLOR.DOT_SIX.SAKURA_SHAD)
    return 'Dot SIX（サクラシャッド）';
  else if (lureType === LURETYPES.BOXER) return 'Boxer（ビーバーレイクシャッド）';
  else if (
    lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
    color === LURE_COLOR.SUPER_JORDAN_68.BCL_SAKURA
  )
    return 'Super Jordan 68（BCL SAKURA）';
  else if (
    lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
    color === LURE_COLOR.SUPER_JORDAN_68.BCL_KIZAKURA
  )
    return 'Super Jordan 68（BCL KIZAKURA）';
  else if (lureType === LURETYPES.TAPPEI_BNSP) return 'TAPPEI BNSP';
  else if (lureType === LURETYPES.SCREW_WAKATARO) return 'SCREW_WAKATARO';
  else if (lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI) return '表層バカ一代Z';
  else if (lureType === LURETYPES.RANKAKU_80) return '乱獲80';
  else if (lureType === LURETYPES.BALAM_300_YUKI) return 'BALAM300 幽鬼';
  else if (lureType === LURETYPES.VARIANT_255_YUKI) return 'VARIANT255 幽鬼';
  else if (lureType === LURETYPES.N_SHAD) return 'N-Shad';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.SMOKER_BG_F)
    return 'Coike13mm（#288 スモーカーBG-F）';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F)
    return 'Coike13mm（#289 クリアーオレンジPGG-F）';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.SPG)
    return 'Coike13mm（#290 SPG）';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.EDGE_SHRIMP)
    return 'Coike13mm（#291 エッジシュリンプ）';
  else {
    throw new Error('Input must be a Lure. You had been Lost.');
  }
};

// 表示用の値とデータ保持用のカラーが異なる場合に変換が必要
// シリアルコードのカラーは2桁までを許容しているため、3桁で表示したい場合はこのメソッドで変換する
export const convertToColorNumber = (lureType: string, color: string) => {
  if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.SMOKER_BG_F) return '288';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F)
    return '289';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.SPG) return '290';
  else if (lureType === LURETYPES.COIKE && color === LURE_COLOR.COIKE.EDGE_SHRIMP) return '291';
};

export const REPORT_TYPES = [
  { value: 'BULLYING', name: 'いじめ、または望まない接触' },
  { value: 'SELF_INJURIOUS', name: '自殺・自傷行為・摂食障害' },
  { value: 'VIOLENCE', name: '暴力、ヘイト、または搾取' },
  { value: 'RESTRICTED_GOODS', name: '制限された商品を宣伝している' },
  { value: 'SEXUAL', name: 'ヌードまたは性的行為' },
  { value: 'FRAUD', name: '詐欺またはスパム' },
  { value: 'UNTRUE', name: '虚偽の情報' },
];
