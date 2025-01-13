import axios from "axios";
import { serverApi } from "../libs/config";
import { Bank, Transaction } from "../libs/types/bank";
import { BankInfoObj } from "../libs/types/others";

class TransactionServiceApi {
    private readonly path: string
    constructor() {
        this.path = serverApi
    }

    async getChosenBankCard(): Promise<Bank> {
        try {
            const url = `${serverApi}/bankcard/getTargetCard`;
            const result = await axios.get(url, { withCredentials: true })
            console.log(`GET getChosenBankCard state ${result.data.state}`)
            const chosenBankCard: Bank = result.data.value[0];
            return chosenBankCard
        } catch (err: any) {
            throw err
        }
    }

    async createBankCard(data: BankInfoObj): Promise<Bank> {
        try {
            const url = `${serverApi}/bankCard/createBankCard`;
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`POST createBankCard ${result.data.state}`)
            const newBankCard: Bank = result.data.value[0];
            return newBankCard
        } catch (err: any) {
            throw err
        }
    }
    async createTransactionData(data: any): Promise<Transaction> {
        try {
            const url = `${this.path}/bankCard/transaction`;
            const result = await axios.post(url, data, { withCredentials: true })
            console.log(`POST: createTransactionData State, ${result.data.state}`)
            const transactionData: Transaction = result.data.value;
            return transactionData
        } catch (err: any) {
            throw err
        }
    }
    async getChosenTransaction(id: any): Promise<Transaction> {
        try {
            const url = `${serverApi}/bankCard/transaction/${id}`;
            const result = await axios.get(url, { withCredentials: true });
            console.log(`GET getChosenTransaction State, ${result.data.state}`);
            const transactionData: Transaction = result.data.value[0];
            return transactionData
        } catch (err: any) {
            console.log(err)
            throw err
        }
    }
}

export default TransactionServiceApi