'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductByHandle, formatPrice } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/shopify';
import CountdownTimer from '@/components/CountdownTimer';

export default function ProductoPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (handle) {
      getProductByHandle(handle).then((p) => {
        setProduct(p);
        setLoading(false);
      });
    }
  }, [handle]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/4" />
            <div className="h-20 bg-gray-100 rounded" />
            <div className="h-12 bg-gray-100 rounded-xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">😿</span>
        <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
        <p className="text-gray-500 mb-6">No pudimos encontrar el producto que buscás.</p>
        <Link href="/catalogo" className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-red-700 transition-colors">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const images = product.images.edges.map((e) => e.node);
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const currentImage = images[selectedImage] || product.featuredImage;
  const isDemo = currentImage?.url.startsWith('/products/');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-red-600 transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/catalogo" className="hover:text-red-600 transition-colors">Catálogo</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden bg-gray-50 relative"
            style={{
              aspectRatio:
                currentImage?.width && currentImage?.height
                  ? `${currentImage.width} / ${currentImage.height}`
                  : '1 / 1',
            }}
          >
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                OFERTA
              </div>
            )}
            {/* Free shipping badge */}
            <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              GRATIS
            </div>
            {isDemo ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-8xl">{product.productType === 'Gatos' ? '🐱' : '🐕'}</span>
              </div>
            ) : currentImage ? (
              <Image src={currentImage.url} alt={currentImage.altText || product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
            ) : null}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === selectedImage ? 'border-red-600 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}>
                  <Image src={img.url} alt={img.altText || ''} width={80} height={80} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-red-600 font-medium mb-1">{product.productType || 'Pet Paradise'}</p>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{product.title}</h1>
            {handle === 'kit-premium-de-paseo-para-perros' && (
              <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                <div className="relative inline-flex">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={`bg-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex overflow-hidden" style={{ width: '90%' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={`fg-${i}`} className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-bold text-green-800">4.5</span>
                <span className="text-xs text-green-700">(238 reseñas)</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(compareAt.amount, compareAt.currencyCode)}</span>
              )}
              <span className={`text-3xl font-black ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {hasDiscount && (
                <span className="bg-red-600 text-white text-sm font-black px-3 py-1 rounded-full">
                  -{Math.round((1 - parseFloat(price.amount) / parseFloat(compareAt.amount)) * 100)}% OFF
                </span>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium mt-1">
              3 cuotas sin interés x {formatPrice((parseFloat(price.amount) / 3).toFixed(2), price.currencyCode)}
            </p>
          </div>

          <CountdownTimer />

          {handle === 'kit-premium-de-paseo-para-perros' ? (
            <div className="space-y-3">
              {/* Intro */}
              <p className="text-gray-700 text-sm leading-relaxed">
                El combo ideal para pasear a tu mascota con <strong className="text-gray-900">comodidad, higiene y todo lo necesario</strong> en un solo kit.
              </p>

              {/* Items breakdown */}
              <div className="space-y-2.5">
                <div className="flex gap-3 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">💧</div>
                  <div className="min-w-0">
                    <h4 className="font-black text-gray-900 text-sm mb-0.5">Botella Portátil Premium</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">Mantené a tu perro hidratado en cualquier momento con su diseño práctico, portátil y antigoteo.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">🧹</div>
                  <div className="min-w-0">
                    <h4 className="font-black text-gray-900 text-sm mb-0.5">Juntador de Excremento</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">Olvidate de los paseos incómodos. Llevá las bolsas de forma práctica y mantené todo limpio.</p>
                  </div>
                </div>
              </div>

              {/* Features pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {[
                  'Diseño portátil y liviano',
                  'Sistema antigoteo',
                  'Fácil de usar y transportar',
                  'Ideal para paseos y viajes',
                  'Material resistente y seguro',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-green-50/60 border border-green-100 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    <span className="text-xs font-semibold text-green-900">{item}</span>
                  </div>
                ))}
              </div>

              {/* Gift highlight */}
              <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl p-4 shadow-lg overflow-hidden">
                <div className="absolute -right-4 -top-4 text-7xl opacity-10 rotate-12 select-none">🎁</div>
                <div className="relative flex items-start gap-3">
                  <span className="text-3xl shrink-0">🎁</span>
                  <div>
                    <p className="font-black uppercase text-xs tracking-widest text-white/80">Hoy te llevás de regalo</p>
                    <p className="font-bold text-sm mt-0.5">Chaleco para el frío + Envío gratis</p>
                  </div>
                </div>
              </div>

              {/* Urgency banner */}
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Promoción por tiempo limitado · últimas unidades</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm text-gray-600 max-w-none" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || `<p>${product.description}</p>` }} />
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Cantidad:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">−</button>
              <span className="w-12 h-10 flex items-center justify-center font-bold text-sm border-x border-gray-200">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button onClick={() => addItem(product, quantity)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-base"
            id="add-to-cart-detail">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Agregar al carrito
          </button>
        </div>
      </div>

    </div>
  );
}
