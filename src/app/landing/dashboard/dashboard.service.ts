import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    async getConfirmedByDistributor(distributorId: any, status: string) {
        var url = this.apiurl + '/purchase-order/getAllByDistribuotr/' + encodeURIComponent(distributorId) + '/' + encodeURIComponent(status) + '?pageSize=3';
        const pos = await lastValueFrom(this.http.get<any>(url));
        return pos;
    }
    async getConfirmedByStore(storeId: any, status: string) {
        var url = this.apiurl + '/purchase-order/getAllByStore/' + encodeURIComponent(storeId) + '/' + encodeURIComponent(status) + '?pageSize=3';
        const pos = await lastValueFrom(this.http.get<any>(url));
        return pos;
    }

    apiurl: string = environment.apiurl;
    constructor(private http: HttpClient) { }

    async getStoreMetrics() {
        var url = this.apiurl + '/dashboard/store-metrics'
        const metrics = await lastValueFrom(this.http.get<any>(url));
        return metrics;
    }

    async getSalesChartData() {
        var url = this.apiurl + '/dashboard/store-chartsdata'
        const data = await lastValueFrom(this.http.get<any>(url));
        return data;
    }

    async getDistributorChartData() {
        var url = this.apiurl + '/dashboard/distributor-chartsdata'
        const data = await lastValueFrom(this.http.get<any>(url));
        return data;
    }
    async getDistributorMetrics() {
        var url = this.apiurl + '/dashboard/distributor-metrics'
        const metrics = await lastValueFrom(this.http.get<any>(url));
        return metrics;
    }

    async getReadWalkthrough(storeId: any) {
        var url = this.apiurl + '/dashboard/store-walkthrough/' + encodeURIComponent(storeId);
        const pos = await lastValueFrom(this.http.get<any>(url));
        return pos;
    }
}