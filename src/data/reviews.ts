export interface Review {
  id: string
  userName: string
  userImage: string
  location: string
  rating: number
  date: string
  comment: string
  source: string
  hostResponse?: string
}

export const reviews: Review[] = [
  {
    id: 'airbnb_1',
    userName: 'Dina',
    userImage: 'https://a0.muscache.com/im/pictures/user/default_user_image.jpg',
    location: 'תל אביב, ישראל',
    rating: 5,
    date: 'ינואר 2026',
    comment: 'יחידת דיור נהדרת, נוחה ותואמת לתיאור. היינו זוג הורים עם שתי בנות והיה פשוט מושלם!',
    source: 'airbnb',
  },
  {
    id: 'booking_1',
    userName: 'טל',
    userImage: 'https://ui-avatars.com/api/?name=טל&background=003580&color=fff',
    location: 'ישראל',
    rating: 5,
    date: 'נובמבר 2025',
    comment:
      "דירה סופר נעימה, מאובזרת מהמטבח ועד לרמת המגבות אמבטיה נקיות, מרווחת, מעוצבת בטוב טעם ובמחיר הוגן ממש. המיקום מעולה לכל מי שמגיע לטייל באזור - 5 דק' מהנחל ונוף מטריף מהמרפסת.",
    source: 'booking',
  },
  {
    id: 'booking_2',
    userName: 'אנונימי',
    userImage: 'https://ui-avatars.com/api/?name=א&background=003580&color=fff',
    location: 'ישראל',
    rating: 5,
    date: 'נובמבר 2025',
    comment: 'דירה עם נוף מהמם. מאובזרת בכול מה שצריך לחופשה משפחתית. מיקום מצוין ומארחים מקסימים.',
    source: 'booking',
  },
  {
    id: 'airbnb_2',
    userName: 'Bar',
    userImage: 'https://a0.muscache.com/im/pictures/user/default_user_image.jpg',
    location: 'תל אביב-יפו, ישראל',
    rating: 5,
    date: 'אוקטובר 2025',
    comment: 'המיקום היה נפלא , הנוף מדהים והדירה היתה נוחה ונעימה. תודה רבה!',
    source: 'airbnb',
  },
  {
    id: 'airbnb_3',
    userName: 'Tevvel',
    userImage: 'https://a0.muscache.com/im/pictures/user/default_user_image.jpg',
    location: 'ישראל',
    rating: 5,
    date: 'אוקטובר 2025',
    comment:
      'דירה גדולה ומשופצת, מטבח מאובזר ומרווח ככה שיכולנו לבשל את כל הארוחות, הנוף מהמרפסת מהמם.',
    source: 'airbnb',
    hostResponse: 'שמחנו מאוד לארח אותכם 😀',
  },
  {
    id: 'airbnb_4',
    userName: 'Shahar',
    userImage: 'https://a0.muscache.com/im/Portrait/Avatars/messaging/b3e03835-ade9-4eb7-a0bb-2466ab9a534d.jpg?im_t=%D0%91&im_w=240',
    location: 'ישראל',
    rating: 5,
    date: 'ספטמבר 2025',
    comment: 'דירה גדולה ומרווחת. מרפסת גדולה עם נוף לחרמון. דירה חדשה ונקייה, התמונות לגמרי משקפות.',
    source: 'airbnb',
    hostResponse: 'המון תודה לכם על הביקורת המפרגנת!',
  },
]
