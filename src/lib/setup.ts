// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';

// Read env var
config();

// Enable colorette
colorette.createColors({ useColor: true });