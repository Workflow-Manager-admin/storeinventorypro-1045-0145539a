import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Data models
export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  stock_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryHistory {
  id: number;
  product_id: number;
  action: string;
  quantity: number;
  timestamp: string;
  note?: string;
}

export interface ApiHealth {
  status: string;
}

export interface StockChangePayload {
  quantity: number;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = '/api'; // adjust as needed if proxy is configured

  constructor(private http: HttpClient) {}

  // PUBLIC_INTERFACE
  health(): Observable<ApiHealth> {
    /** Checks backend server health. */
    return this.http.get<ApiHealth>(`${this.baseUrl}/health`);
  }

  // PUBLIC_INTERFACE
  sqliteHealth(): Observable<ApiHealth> {
    /** Checks backend SQLite connection health. */
    return this.http.get<ApiHealth>(`${this.baseUrl}/health/sqlite`);
  }

  // PUBLIC_INTERFACE
  getProducts(search?: string, category?: string, minStock?: number): Observable<Product[]> {
    /** Gets a list of products with optional search/filter. */
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (minStock !== undefined) params = params.set('min_stock', minStock.toString());
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }

  // PUBLIC_INTERFACE
  getProduct(productId: number): Observable<Product> {
    /** Gets detail of a single product by ID. */
    return this.http.get<Product>(`${this.baseUrl}/products/${productId}`);
  }

  // PUBLIC_INTERFACE
  addProduct(product: Partial<Product>): Observable<Product> {
    /** Adds a new product. */
    return this.http.post<Product>(`${this.baseUrl}/products`, product);
  }

  // PUBLIC_INTERFACE
  updateProduct(productId: number, product: Partial<Product>): Observable<Product> {
    /** Updates an existing product. */
    return this.http.put<Product>(`${this.baseUrl}/products/${productId}`, product);
  }

  // PUBLIC_INTERFACE
  deleteProduct(productId: number): Observable<void> {
    /** Deletes a product by ID. */
    return this.http.delete<void>(`${this.baseUrl}/products/${productId}`);
  }

  // PUBLIC_INTERFACE
  updateStock(productId: number, payload: StockChangePayload): Observable<Product> {
    /** Adds or removes stock for a product. */
    return this.http.post<Product>(`${this.baseUrl}/products/${productId}/stock`, payload);
  }

  // PUBLIC_INTERFACE
  getProductHistory(productId: number): Observable<InventoryHistory[]> {
    /** Gets inventory history for a product. */
    return this.http.get<InventoryHistory[]>(`${this.baseUrl}/products/${productId}/history`);
  }

  // PUBLIC_INTERFACE
  getHistory(): Observable<InventoryHistory[]> {
    /** Gets full inventory history. */
    return this.http.get<InventoryHistory[]>(`${this.baseUrl}/history`);
  }
}
