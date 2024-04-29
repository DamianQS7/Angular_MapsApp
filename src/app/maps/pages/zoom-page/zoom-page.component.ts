import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import mapboxgl, { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-page.component.html',
  styleUrl: './zoom-page.component.css'
})
export class ZoomPageComponent implements AfterViewInit, OnDestroy{
  
  @ViewChild('map') 
  public divMap?: ElementRef;
  
  public map?: Map;
  public currentZoom: number = 10;
  public centerCoords: LngLat = new LngLat(-72.47642663873273, -38.733770656760115);
  
  ngAfterViewInit(): void {
    
    if (!this.divMap) throw 'HTML Element was not found';
    
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.centerCoords, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });
    
    this.mapListeners();
  }
  
  ngOnDestroy(): void {
    this.map?.remove();
  }

  private mapListeners(): void {
    if(!this.map) throw 'Map not initialized';
    
    this.map.on('zoom', (e) => {
      this.currentZoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (e) => {
      if (this.map!.getZoom() < 18) return;

      this.map!.zoomTo(18);
    });

    this.map.on('move', (e) =>{
      this.centerCoords = this.map!.getCenter();
    });
  }

  public zoomIn(): void { 
    this.map?.zoomIn();
  }

  public zoomOut(): void {
    this.map?.zoomOut();
  }

  public zoomChanged(value: string): void {
    this.currentZoom = Number(value);
    this.map?.zoomTo(this.currentZoom); 
  }
}
