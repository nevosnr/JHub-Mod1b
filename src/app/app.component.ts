import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Root, Result, position } from './APIData'
import { NgModule } from '@angular/core';
import {MatPaginator, PageEvent } from '@angular/material/paginator'
import {MatSort, SortDirection} from '@angular/material/sort';
declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'Mod1b';
  postcodeEntered = "nothing yet"
  readonly ROOT_URL = "https://api.postcodes.io/postcodes/"
  public APIReturns: any = {"longitude": 150.644, "latitude": -34.397,}
  public policeData: any = []
  public pageSlice = this.policeData.slice(0, 10);
  public positions: any
  public positionsArray: any[] = []
  postcodeData: string
  map: any;
  PoliceDataPageCount = 0;
  PoliceStationsPageCount = 0
  @ViewChild("mapElement") mapElement: any;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns2: string[] = ['position', 'name'];
  dataSource = this.policeData;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  postcodeFormControl = new FormControl('', [Validators.required]);

  constructor(private http: HttpClient) {}

  // https://material.angular.io/components/table/examples

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //google map API code here
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: this.APIReturns.latitude, lng: this.APIReturns.longitude},
      zoom: 15
    });
  }

  changeMap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: this.APIReturns.latitude, lng: this.APIReturns.longitude},
      zoom: 15
    });
    const positions = this.policeData.location
    const marker1 = new google.maps.Marker({
      position : {lat:53.045122,lng:-0.384205},
      map: this.map,
      icon: "../assets/police.png",
    })

  }




  getPoliceData(){
    const policeURLDatajson = {"lat=": this.APIReturns.latitude, "&lng=": this.APIReturns.longitude}
    const policeURLData = JSON.stringify(policeURLDatajson).replace(/[{}":,]/g, '');
    this.http.get("https://data.police.uk/api/crimes-street/all-crime?" + policeURLData).subscribe((data: any) => this.policeData = data ).add(() => { this.PoliceDataPageCount = this.policeData.length, this.pageSlice = this.policeData.slice(0, 10)
  })
}

  getPoliceLocation(){
    var PoliceURLGet: any = []
    const policeURLDatajson = {"lat=": this.APIReturns.latitude, "&lng=": this.APIReturns.longitude}
    const policeURLData = JSON.stringify(policeURLDatajson).replace(/[{}":,]/g, '');
    this.http.get("https://data.police.uk/api/crimes-street/all-crime?" + policeURLData).subscribe((data: any) =>{
      this.positions = data;
      this.positionsArray = []
      for (let i = 0; i < data.length; i++){
        this.positionsArray.push({
          lat: this.positions[i].location.latitude,
          lng: this.positions[i].location.longitude,
          lable: this.positions[i].category,
        }
        )
      }
      for (let i = 0; i < this.positionsArray.length; i++){
        const marker1 = new google.maps.Marker({
          position : {lat: parseFloat(this.positions[i].location.latitude),lng: parseFloat(this.positions[i].location.longitude)},
          map: this.map,
          lable: this.positionsArray[i].lable,
          icon: "../assets/police.png",
        })
        const infoWindow = new google.maps.InfoWindow({
          content: "",
          disableAutoPan: true,
        });
        marker1.addListener("click", () => {
          infoWindow.setContent(marker1.lable);
          infoWindow.open(this.map, marker1);
        });
      }
      JSON.stringify(this.positionsArray).replace(/["]/g, '')
      // console.log(this.positions[0].location)

    })
  }

  submit(){
    if (this.postcodeFormControl.valid == true){ // if the form is valid then do the next bunch of bits
      this.postcodeEntered = this.postcodeFormControl.value
      this.postcodeEntered = (this.postcodeEntered.replace(/\s/g, "")) //gets rid of the spaces in the form
      // http get set
      this.http.get<Result[]>(this.ROOT_URL + this.postcodeEntered).subscribe((data: any) => this.APIReturns = {
        postcode: data.result.postcode,
        longitude: data.result.longitude,
        latitude: data.result.latitude,
        country: data.result.country,
        parliamentary_constituency: data.result.parliamentary_constituency,
        region: data.result.region,
        admin_district: data.result.admin_district,
        admin_county: data.result.admin_county
      }).add(() => {
        this.changeMap(),
        this.getPoliceData(),
        this.getPoliceLocation()
      })
      this.changeMap()
    } else { // if the form is not valid the do the next bunch of bits
      this.postcodeEntered = "Form not valid"
    }
  }

  OnPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.policeData.length) {
      endIndex = this.policeData.length;
    }
    this.pageSlice = this.policeData.slice(startIndex, endIndex)
  }
}
