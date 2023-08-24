#!/usr/bin/env node
import {pkgUp} from 'pkg-up';
import { processPackage } from './processPackage';

await processPackage(await pkgUp())