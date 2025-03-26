//Types -Global - Google Maps

declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}

// Declaración mínima para Google Maps
declare namespace google {
    namespace maps {
        class Map {
            constructor(mapDiv: Element, opts?: MapOptions);
            setCenter(latLng: LatLng | LatLngLiteral): void;
            setZoom(zoom: number): void;
            fitBounds(bounds: LatLngBounds): void;
            getZoom(): number;
            getCenter(): LatLng;
            panTo(latLng: LatLng | LatLngLiteral): void;
            getBounds(): LatLngBounds | undefined;
        }

        class Marker {
            constructor(opts?: MarkerOptions);
            setMap(map: Map | null): void;
            getPosition(): LatLng | null;
            setPosition(latLng: LatLng | LatLngLiteral): void;
            setTitle(title: string): void;
            setIcon(icon: string | Icon | Symbol): void;
            addListener(eventName: string, handler: Function): MapsEventListener;
        }

        class InfoWindow {
            constructor(opts?: InfoWindowOptions);
            open(map: Map, anchor?: MVCObject): void;
            setContent(content: string | Node): void;
            close(): void;
            getPosition(): LatLng | null;
            setPosition(latLng: LatLng | LatLngLiteral): void;
        }

        class LatLngBounds {
            constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
            extend(point: LatLng | LatLngLiteral): LatLngBounds;
            contains(latLng: LatLng | LatLngLiteral): boolean;
            getCenter(): LatLng;
            getNorthEast(): LatLng;
            getSouthWest(): LatLng;
            isEmpty(): boolean;
            toJSON(): object;
        }

        class LatLng {
            constructor(lat: number, lng: number, noWrap?: boolean);
            lat(): number;
            lng(): number;
            equals(other: LatLng): boolean;
            toJSON(): object;
            toString(): string;
            toUrlValue(precision?: number): string;
        }

        interface MapOptions {
            center?: LatLng | LatLngLiteral;
            zoom?: number;
            mapTypeId?: string;
            mapTypeControl?: boolean;
            streetViewControl?: boolean;
            fullscreenControl?: boolean;
            zoomControl?: boolean;
            gestureHandling?: string;
            styles?: Array<MapTypeStyle>;
            draggable?: boolean;
            scrollwheel?: boolean;
            disableDoubleClickZoom?: boolean;
            maxZoom?: number;
            minZoom?: number;
        }

        interface MapTypeStyle {
            elementType?: string;
            featureType?: string;
            stylers: Array<{ [key: string]: any }>;
        }

        interface MarkerOptions {
            position: LatLng | LatLngLiteral;
            map?: Map;
            title?: string;
            icon?: string | Icon | Symbol;
            label?: string | MarkerLabel;
            draggable?: boolean;
            clickable?: boolean;
            animation?: number;
            opacity?: number;
            visible?: boolean;
            zIndex?: number;
        }

        interface MarkerLabel {
            text: string;
            color?: string;
            fontFamily?: string;
            fontSize?: string;
            fontWeight?: string;
        }

        interface InfoWindowOptions {
            content?: string | Node;
            disableAutoPan?: boolean;
            maxWidth?: number;
            pixelOffset?: Size;
            position?: LatLng | LatLngLiteral;
            zIndex?: number;
        }

        interface LatLngLiteral {
            lat: number;
            lng: number;
        }

        interface Icon {
            url: string;
            size?: Size;
            origin?: Point;
            anchor?: Point;
            scaledSize?: Size;
            labelOrigin?: Point;
        }

        interface Size {
            width: number;
            height: number;
            equals(other: Size): boolean;
            toString(): string;
        }

        interface Point {
            x: number;
            y: number;
            equals(other: Point): boolean;
            toString(): string;
        }

        interface Symbol {
            path: string | number;
            fillColor?: string;
            fillOpacity?: number;
            scale?: number;
            strokeColor?: string;
            strokeOpacity?: number;
            strokeWeight?: number;
        }

        interface MVCObject {
            addListener(eventName: string, handler: Function): MapsEventListener;
            bindTo(key: string, target: MVCObject, targetKey?: string): void;
            get(key: string): any;
            notify(key: string): void;
            set(key: string, value: any): void;
            setValues(values: any): void;
            unbind(key: string): void;
            unbindAll(): void;
        }

        interface MapsEventListener {
            remove(): void;
        }

        // Constantes para los tipos de mapa
        namespace MapTypeId {
            const ROADMAP: string;
            const SATELLITE: string;
            const HYBRID: string;
            const TERRAIN: string;
        }

        // Constantes para las animaciones de marcadores
        namespace Animation {
            const DROP: number;
            const BOUNCE: number;
        }

        // Clase para controlar la visualización de la capa de tráfico
        class TrafficLayer {
            constructor();
            setMap(map: Map | null): void;
        }

        // Clase para controlar mapas de calor
        class HeatmapLayer {
            constructor(opts?: HeatmapLayerOptions);
            setMap(map: Map | null): void;
            setData(data: Array<LatLng | LatLngLiteral | WeightedLocation>): void;
        }

        interface HeatmapLayerOptions {
            data?: Array<LatLng | LatLngLiteral | WeightedLocation>;
            map?: Map;
            radius?: number;
            opacity?: number;
            gradient?: Array<string>;
        }

        interface WeightedLocation {
            location: LatLng | LatLngLiteral;
            weight: number;
        }

        // Clase para controlar eventos del mapa
        class event {
            static addListener(instance: MVCObject, eventName: string, handler: Function): MapsEventListener;
            static addDomListener(instance: Element, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
            static clearInstanceListeners(instance: MVCObject): void;
            static trigger(instance: any, eventName: string, ...args: any[]): void;
        }
    }
}