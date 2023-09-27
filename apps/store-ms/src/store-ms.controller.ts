import { Controller, Get, Param } from '@nestjs/common';
import { Span } from 'nestjs-otel';

@Controller('store')
export class StoreMsController {

  @Get(':id')
  @Span("get-store-ms")
  async getStoreById(@Param('id') storeId: number) {
    console.log('store-request', storeId)
    return await Promise.resolve({
      id: storeId,
      idSap: "P510",
      idSupportPurchase: 64,
      name: "Paris Fake Center",
      address: "Av. Fake Vicuña Mackenna",
      streetNumber: "6100",
      latitude: -33.510724,
      longitude: -70.6065,
      type: "PA",
      adsPrimary: "10.106.59.251",
      adsSecondary: "10.106.59.253",
      regionCode: 13,
      regionName: "Región Metropolitana",
      comunaCode: "130103",
      comunaName: "LA FLORIDA",
      promotionStrategy: "http",
    })
  }
}
