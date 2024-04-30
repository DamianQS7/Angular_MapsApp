import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements AfterViewInit {
  
  @Input()
  public lngLat?: [number, number];
  
  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;

  ngAfterViewInit(): void {
    if (!this.lngLat) throw 'LngLat can not be null';
    if (!this.divMap?.nativeElement) throw 'DivMap not found';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false,
    });

    new Marker()
      .setLngLat( this.lngLat )
      .addTo( this.map );
  }
}
