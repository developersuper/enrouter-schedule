import { SchedulingAPI } from "./scheduling/scheduling";
import { AreasAPI } from "./scheduling/areas";
import { MapsAPI } from "./maps/maps";
import { GoogleMapAPI } from "./maps/google";
import { UserAuthenticationAPI } from "./auth/auth";
import { BillingController } from "./billing/billing";
import Utils from "./utils/utils";
import { AppointmentAPI } from "./scheduling/appointment";
import GoogleAPI from "./googleapi/googleapi";
import smart from "./smart-schedule/index";

const api = {
  appointment: AppointmentAPI,
  scheduling: SchedulingAPI,
  maps: MapsAPI,
  auth: UserAuthenticationAPI,
  billing: BillingController,
  areas: AreasAPI,
  googleMap: GoogleMapAPI,
  utils: Utils,
  googleApi: GoogleAPI,
  smart,
};

export default api;
