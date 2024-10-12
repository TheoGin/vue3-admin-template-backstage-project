export interface ResponceData {
    code: number
    message: string
    ok: boolean
}

export interface Trademark{
    id?: number
    tmName: string
    logoUrl: string
}

export type Records = Trademark[];

// 已有品牌返回的数据类型
export interface TrademarkResponceData extends ResponceData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}