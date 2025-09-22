/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, MoveTuple } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import * as vec_map from './deps/sui/vec_map.js';
import * as vec_set from './deps/sui/vec_set.js';
import * as type_name from './deps/std/type_name.js';
import * as versioned from './deps/sui/versioned.js';
const $moduleName = '0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417::auth';
export const Auth = new MoveStruct({ name: `${$moduleName}::Auth`, fields: {
        member_permissions: vec_map.VecMap(bcs.Address, vec_set.VecSet(type_name.TypeName)),
        config: versioned.Versioned
    } });
export const EditPermissions = new MoveTuple({ name: `${$moduleName}::EditPermissions`, fields: [bcs.bool()] });