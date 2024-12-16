#!/usr/bin/env node
import { DotContextServer } from './server.js';

const server = new DotContextServer();
server.run().catch(console.error);