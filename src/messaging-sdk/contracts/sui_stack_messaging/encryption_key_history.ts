/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, MoveTuple } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import * as table_vec from './deps/sui/table_vec.js';
const $moduleName = '0x857e46acfe15fca0c68be86897b1af542bc686d397c171da48911e797d6c8417::encryption_key_history';
export const EncryptionKeyHistory = new MoveStruct({ name: `${$moduleName}::EncryptionKeyHistory`, fields: {
        latest: bcs.vector(bcs.u8()),
        latest_version: bcs.u32(),
        history: table_vec.TableVec
    } });
export const EditEncryptionKey = new MoveTuple({ name: `${$moduleName}::EditEncryptionKey`, fields: [bcs.bool()] });