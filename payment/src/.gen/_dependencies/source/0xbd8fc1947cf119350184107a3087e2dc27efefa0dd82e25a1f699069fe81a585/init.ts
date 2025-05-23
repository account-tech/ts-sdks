import * as collectible from "./collectible/structs";
import * as floorPriceRule from "./floor-price-rule/structs";
import * as kioskLockRule from "./kiosk-lock-rule/structs";
import * as personalKioskRule from "./personal-kiosk-rule/structs";
import * as personalKiosk from "./personal-kiosk/structs";
import * as royaltyRule from "./royalty-rule/structs";
import * as witnessRule from "./witness-rule/structs";
import {StructClassLoader} from "../../../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(collectible.Registry);
loader.register(collectible.CollectionCap);
loader.register(collectible.CollectionTicket);
loader.register(collectible.Collectible);
loader.register(collectible.COLLECTIBLE);
loader.register(floorPriceRule.Rule);
loader.register(floorPriceRule.Config);
loader.register(kioskLockRule.Rule);
loader.register(kioskLockRule.Config);
loader.register(personalKiosk.PersonalKioskCap);
loader.register(personalKiosk.Borrow);
loader.register(personalKiosk.OwnerMarker);
loader.register(personalKiosk.NewPersonalKiosk);
loader.register(personalKioskRule.Rule);
loader.register(royaltyRule.Rule);
loader.register(royaltyRule.Config);
loader.register(witnessRule.Rule);
 }
