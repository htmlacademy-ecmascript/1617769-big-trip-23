import ApiService from '../framework/api-service';
import { ApiMethod, ApiRoute } from './trip-api-const';
import { toCamelCaseKeys, toSnakeCaseKeys } from './trip-api-utils';

export default class TripApiService extends ApiService {
  getPoints = async () => ApiService.parseResponse(
    await this._load({ url: ApiRoute.POINTS, method: ApiMethod.GET })
  );

  addPoint = async (point) => {
    const response = await this._load({
      url: ApiRoute.POINTS,
      method: ApiMethod.POST,
      body: TripApiService.adaptToServer(point),
      headers: this.#getHeader()
    });
    return TripApiService.adaptToClient(await ApiService.parseResponse(response));
  };

  updatePoint = async (point) => {
    const response = await this._load({
      url: this.#getRoutePointID(point),
      method: ApiMethod.PUT,
      body: TripApiService.adaptToServer(point),
      headers: this.#getHeader()
    });
    return TripApiService.adaptToClient(await ApiService.parseResponse(response));
  };

  deletePoint = async (point) => await this._load({ url: this.#getRoutePointID(point), method: ApiMethod.DELETE });

  getOffers = async () => ApiService.parseResponse(
    await this._load({ url: ApiRoute.OFFERS, method: ApiMethod.GET })
  );

  getDestinations = async () => ApiService.parseResponse(
    await this._load({ url: ApiRoute.DESTINATIONS, method: ApiMethod.GET })
  );

  #getRoutePointID = ({ id }) => `${ApiRoute.POINTS}/${id}`;
  #getHeader = () => new Headers({'Content-Type': 'application/json'});

  static adaptToServer = (tripPoint) => JSON.stringify(toSnakeCaseKeys(tripPoint));

  static adaptToClient = (point) => {
    const { dateFrom, dateTo, ...rest } = toCamelCaseKeys(point);
    return {
      ...rest,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
    };
  };
}
