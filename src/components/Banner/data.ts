
export type BannerItem = {
    title: string;
    image: string;
    description: string;
    type: 'ablum' | 'song',
    id: string;
}


export default [
    {
        title: 'Town',
        image: '121710387669_.pic',
        description: 'the fur',
        type: 'ablum',
        id: '1'
    },
    {
        title: '给你们',
        image: '181710387676_.pic',
        description: '万芳',
        type: 'ablum',
        id: '2'
    },
    {
        title: 'My life will...',
        image: '231710387683_.pic',
        description: '安溥',
        type: 'ablum',
        id: '3'
    },
    {
        title: '眼泪博物馆',
        image: '1531710387730_.pic',
        description: '郑兴',
        type: 'ablum',
        id: '4'
    },
] as BannerItem[]