import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import type { CategoryResponceData } from "@/api/product/attr/type";
import type { CategoryState } from "./types/type";
import axios from 'axios';

let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            category1Arr: [],
            c1Id: '',
            category2Arr: [],
            c2Id: '',
            category3Arr: [],
            c3Id: '',
        }
    },
    actions: {
        async getC1() {
            let res: CategoryResponceData = await reqC1();
            // let res: CategoryResponceData = await axios.get<any, CategoryResponceData>('http://39.98.123.211:8510/admin/product/getCategory1');
            // console.log('res', res);
            this.category1Arr = res.data
        },
        async getC2() {
            const res: CategoryResponceData = await reqC2(this.c1Id);
            // console.log(res);
            this.category2Arr = res.data;
        },
        async getC3() {
            const res: CategoryResponceData = await reqC3(this.c2Id);
            // console.log(res);
            this.category3Arr = res.data;
        },
    },
    getters: {

    }
})

export default useCategoryStore