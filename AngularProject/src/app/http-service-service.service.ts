import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http:HttpClient) { }

  
  cpuUse(){
    return this.http.get("http://localhost:8080/actuator/metrics/system.cpu.usage").pipe(map(result=>result))
  }
  memoryInfo(){
    return this.http.get("http://localhost:8080/actuator/health/diskSpace")
    .pipe(map(result=>result));
  }
}
