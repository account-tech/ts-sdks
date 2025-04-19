import {PhantomReified, Reified, StructClass, ToField, ToTypeStr, decodeFromFields, decodeFromFieldsWithTypes, decodeFromJSONField, phantom} from "../../_framework/reified";
import {FieldsWithTypes, composeSuiType, compressSuiType} from "../../_framework/util";
import {Dao} from "../dao/structs";
import {PKG_V1} from "../index";
import {bcs} from "@mysten/sui/bcs";
import {SuiClient, SuiObjectData, SuiParsedData} from "@mysten/sui/client";
import {fromB64} from "@mysten/sui/utils";

/* ============================== ConfigDaoIntent =============================== */

export function isConfigDaoIntent(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::config::ConfigDaoIntent`; }

export interface ConfigDaoIntentFields { dummyField: ToField<"bool"> }

export type ConfigDaoIntentReified = Reified< ConfigDaoIntent, ConfigDaoIntentFields >;

export class ConfigDaoIntent implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::config::ConfigDaoIntent`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ConfigDaoIntent.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::config::ConfigDaoIntent`; readonly $typeArgs: []; readonly $isPhantom = ConfigDaoIntent.$isPhantom;

 readonly dummyField: ToField<"bool">

 private constructor(typeArgs: [], fields: ConfigDaoIntentFields, ) { this.$fullTypeName = composeSuiType( ConfigDaoIntent.$typeName, ...typeArgs ) as `${typeof PKG_V1}::config::ConfigDaoIntent`; this.$typeArgs = typeArgs;

 this.dummyField = fields.dummyField; }

 static reified( ): ConfigDaoIntentReified { return { typeName: ConfigDaoIntent.$typeName, fullTypeName: composeSuiType( ConfigDaoIntent.$typeName, ...[] ) as `${typeof PKG_V1}::config::ConfigDaoIntent`, typeArgs: [ ] as [], isPhantom: ConfigDaoIntent.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ConfigDaoIntent.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigDaoIntent.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ConfigDaoIntent.fromBcs( data, ), bcs: ConfigDaoIntent.bcs, fromJSONField: (field: any) => ConfigDaoIntent.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ConfigDaoIntent.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ConfigDaoIntent.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ConfigDaoIntent.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ConfigDaoIntent.fetch( client, id, ), new: ( fields: ConfigDaoIntentFields, ) => { return new ConfigDaoIntent( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ConfigDaoIntent.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ConfigDaoIntent>> { return phantom(ConfigDaoIntent.reified( )); } static get p() { return ConfigDaoIntent.phantom() }

 static get bcs() { return bcs.struct("ConfigDaoIntent", {

 dummy_field: bcs.bool()

}) };

 static fromFields( fields: Record<string, any> ): ConfigDaoIntent { return ConfigDaoIntent.reified( ).new( { dummyField: decodeFromFields("bool", fields.dummy_field) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ConfigDaoIntent { if (!isConfigDaoIntent(item.type)) { throw new Error("not a ConfigDaoIntent type");

 }

 return ConfigDaoIntent.reified( ).new( { dummyField: decodeFromFieldsWithTypes("bool", item.fields.dummy_field) } ) }

 static fromBcs( data: Uint8Array ): ConfigDaoIntent { return ConfigDaoIntent.fromFields( ConfigDaoIntent.bcs.parse(data) ) }

 toJSONField() { return {

 dummyField: this.dummyField,

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ConfigDaoIntent { return ConfigDaoIntent.reified( ).new( { dummyField: decodeFromJSONField("bool", field.dummyField) } ) }

 static fromJSON( json: Record<string, any> ): ConfigDaoIntent { if (json.$typeName !== ConfigDaoIntent.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ConfigDaoIntent.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ConfigDaoIntent { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isConfigDaoIntent(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ConfigDaoIntent object`); } return ConfigDaoIntent.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ConfigDaoIntent { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isConfigDaoIntent(data.bcs.type)) { throw new Error(`object at is not a ConfigDaoIntent object`); }

 return ConfigDaoIntent.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ConfigDaoIntent.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ConfigDaoIntent> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ConfigDaoIntent object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isConfigDaoIntent(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ConfigDaoIntent object`); }

 return ConfigDaoIntent.fromSuiObjectData( res.data ); }

 }

/* ============================== ConfigDaoAction =============================== */

export function isConfigDaoAction(type: string): boolean { type = compressSuiType(type); return type === `${PKG_V1}::config::ConfigDaoAction`; }

export interface ConfigDaoActionFields { config: ToField<Dao> }

export type ConfigDaoActionReified = Reified< ConfigDaoAction, ConfigDaoActionFields >;

export class ConfigDaoAction implements StructClass { __StructClass = true as const;

 static readonly $typeName = `${PKG_V1}::config::ConfigDaoAction`; static readonly $numTypeParams = 0; static readonly $isPhantom = [] as const;

 readonly $typeName = ConfigDaoAction.$typeName; readonly $fullTypeName: `${typeof PKG_V1}::config::ConfigDaoAction`; readonly $typeArgs: []; readonly $isPhantom = ConfigDaoAction.$isPhantom;

 readonly config: ToField<Dao>

 private constructor(typeArgs: [], fields: ConfigDaoActionFields, ) { this.$fullTypeName = composeSuiType( ConfigDaoAction.$typeName, ...typeArgs ) as `${typeof PKG_V1}::config::ConfigDaoAction`; this.$typeArgs = typeArgs;

 this.config = fields.config; }

 static reified( ): ConfigDaoActionReified { return { typeName: ConfigDaoAction.$typeName, fullTypeName: composeSuiType( ConfigDaoAction.$typeName, ...[] ) as `${typeof PKG_V1}::config::ConfigDaoAction`, typeArgs: [ ] as [], isPhantom: ConfigDaoAction.$isPhantom, reifiedTypeArgs: [], fromFields: (fields: Record<string, any>) => ConfigDaoAction.fromFields( fields, ), fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigDaoAction.fromFieldsWithTypes( item, ), fromBcs: (data: Uint8Array) => ConfigDaoAction.fromBcs( data, ), bcs: ConfigDaoAction.bcs, fromJSONField: (field: any) => ConfigDaoAction.fromJSONField( field, ), fromJSON: (json: Record<string, any>) => ConfigDaoAction.fromJSON( json, ), fromSuiParsedData: (content: SuiParsedData) => ConfigDaoAction.fromSuiParsedData( content, ), fromSuiObjectData: (content: SuiObjectData) => ConfigDaoAction.fromSuiObjectData( content, ), fetch: async (client: SuiClient, id: string) => ConfigDaoAction.fetch( client, id, ), new: ( fields: ConfigDaoActionFields, ) => { return new ConfigDaoAction( [], fields ) }, kind: "StructClassReified", } }

 static get r() { return ConfigDaoAction.reified() }

 static phantom( ): PhantomReified<ToTypeStr<ConfigDaoAction>> { return phantom(ConfigDaoAction.reified( )); } static get p() { return ConfigDaoAction.phantom() }

 static get bcs() { return bcs.struct("ConfigDaoAction", {

 config: Dao.bcs

}) };

 static fromFields( fields: Record<string, any> ): ConfigDaoAction { return ConfigDaoAction.reified( ).new( { config: decodeFromFields(Dao.reified(), fields.config) } ) }

 static fromFieldsWithTypes( item: FieldsWithTypes ): ConfigDaoAction { if (!isConfigDaoAction(item.type)) { throw new Error("not a ConfigDaoAction type");

 }

 return ConfigDaoAction.reified( ).new( { config: decodeFromFieldsWithTypes(Dao.reified(), item.fields.config) } ) }

 static fromBcs( data: Uint8Array ): ConfigDaoAction { return ConfigDaoAction.fromFields( ConfigDaoAction.bcs.parse(data) ) }

 toJSONField() { return {

 config: this.config.toJSONField(),

} }

 toJSON() { return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() } }

 static fromJSONField( field: any ): ConfigDaoAction { return ConfigDaoAction.reified( ).new( { config: decodeFromJSONField(Dao.reified(), field.config) } ) }

 static fromJSON( json: Record<string, any> ): ConfigDaoAction { if (json.$typeName !== ConfigDaoAction.$typeName) { throw new Error("not a WithTwoGenerics json object") };

 return ConfigDaoAction.fromJSONField( json, ) }

 static fromSuiParsedData( content: SuiParsedData ): ConfigDaoAction { if (content.dataType !== "moveObject") { throw new Error("not an object"); } if (!isConfigDaoAction(content.type)) { throw new Error(`object at ${(content.fields as any).id} is not a ConfigDaoAction object`); } return ConfigDaoAction.fromFieldsWithTypes( content ); }

 static fromSuiObjectData( data: SuiObjectData ): ConfigDaoAction { if (data.bcs) { if (data.bcs.dataType !== "moveObject" || !isConfigDaoAction(data.bcs.type)) { throw new Error(`object at is not a ConfigDaoAction object`); }

 return ConfigDaoAction.fromBcs( fromB64(data.bcs.bcsBytes) ); } if (data.content) { return ConfigDaoAction.fromSuiParsedData( data.content ) } throw new Error( "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request." ); }

 static async fetch( client: SuiClient, id: string ): Promise<ConfigDaoAction> { const res = await client.getObject({ id, options: { showBcs: true, }, }); if (res.error) { throw new Error(`error fetching ConfigDaoAction object at id ${id}: ${res.error.code}`); } if (res.data?.bcs?.dataType !== "moveObject" || !isConfigDaoAction(res.data.bcs.type)) { throw new Error(`object at id ${id} is not a ConfigDaoAction object`); }

 return ConfigDaoAction.fromSuiObjectData( res.data ); }

 }
