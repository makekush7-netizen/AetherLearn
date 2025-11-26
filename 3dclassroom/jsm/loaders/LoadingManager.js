import { EventDispatcher, Loader } from '../../three.module.js';

const _DEFAULT_IMAGE_NAME = '__default';

const _urlMap = new Map();
const _objectCache = new Map();

let _objectsToGUID = new WeakMap();

class LoadingManager extends EventDispatcher {

	constructor( onLoad, onProgress, onError ) {

		super();

		const scope = this;

		let isLoading = false;
		let itemsLoaded = 0;
		let itemsTotal = 0;
		const urlModifier = undefined;

		// Refer to https://developer.mozilla.org/en-US/docs/Web/API/fetch and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
		const handlers = [];

		this.onStart = onLoad;
		this.onLoad = onLoad;
		this.onProgress = onProgress;
		this.onError = onError;

		this.itemStart = function ( url ) {

			itemsTotal ++;

			if ( isLoading === false ) {

				scope.dispatchEvent( { type: 'start' } );

			}

			isLoading = true;

		};

		this.itemEnd = function ( url ) {

			itemsLoaded ++;

			if ( itemsLoaded === itemsTotal ) {

				isLoading = false;

				setTimeout( function () {

					scope.dispatchEvent( { type: 'load' } );

				}, 0 );

			}

		};

		this.itemError = function ( url ) {

			scope.dispatchEvent( { type: 'error', message: 'Failed to load ' + url } );

		};

		this.resolveURL = function ( url ) {

			if ( urlModifier ) {

				return urlModifier( url );

			}

			return url;

		};

		this.getHandler = function ( file ) {

			if ( _urlMap.has( file ) ) {

				return _urlMap.get( file );

			}

			let handler;

			const handlers = [ ..._urlMap.values() ];

			for ( let i = 0; i < handlers.length; i ++ ) {

				handler = handlers[ i ];

				if ( handler.test && handler.test( file ) ) return handler;

			}

			return null;

		};

		this.setHandler = function ( regexp, loaderFunc ) {

			_urlMap.set( regexp, loaderFunc );

		};

		this.addHandler = function ( regexp, loaderFunc ) {

			_urlMap.set( regexp, loaderFunc );

		};

		this.removeHandler = function ( regexp ) {

			_urlMap.delete( regexp );

		};

		this.getObjectByProperty = function ( name, value ) {

			if ( _objectCache.has( value ) ) return _objectCache.get( value );

		};

		this.allocateGUID = function ( object ) {

			if ( ! _objectsToGUID.has( object ) ) {

				const guid = ++ Loader.DEFAULT_MANAGER_ID;
				_objectsToGUID.set( object, guid );
				_objectCache.set( guid, object );

			}

			return _objectsToGUID.get( object );

		};

	}

}

export { LoadingManager };
