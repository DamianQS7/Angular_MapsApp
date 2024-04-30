import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { MarkerColor } from '../../interfaces/marker-color.interface';
import { PlainMarker } from '../../interfaces/plain-marker.interface';

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {
  
  @ViewChild('map') 
  public divMap?: ElementRef;
  public markers: MarkerColor[] = [];
  public map?: Map;
  public centerCoords: LngLat = new LngLat(-72.47642663873273, -38.733770656760115);
  
  ngAfterViewInit(): void {
    
    if (!this.divMap) throw 'HTML Element was not found';
    
    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.centerCoords, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    this.loadFromLocalStorage();
  }

  public createMarker(): void {
    if (!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  public addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({color: color, draggable: true})
      .setLngLat(lngLat)
      .addTo(this.map);
    
    this.markers.push({ color, marker });
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage())
  }

  public deleteMarker(index: number) {
    this.markers[index].marker.remove;
    this.markers.splice(index, 1);
  }

  public flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });
  }

  public saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker}) => {
      return {
        color: color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  public loadFromLocalStorage(): void {
    const plainMarkersString: string = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach( plainMarker => {
      const [ lng, lat ] = plainMarker.lngLat;
      const lngLat = new LngLat( lng, lat);
      this.addMarker(lngLat, plainMarker.color)
    });
  }
}
