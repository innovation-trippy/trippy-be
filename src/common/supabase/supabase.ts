import { Injectable, Logger, Scope } from "@nestjs/common";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { ConfigService } from '@nestjs/config';

@Injectable({scope: Scope.REQUEST})
export class Supabase {
    private readonly logger = new Logger(Supabase.name);
    private clientInstance: SupabaseClient;

    constructor(
        private readonly configService: ConfigService,
    ) {}

    getClient() {
        this.logger.log('getting supabase client...');
        if(this.clientInstance) {
            this.logger.log('client exists - returning for current Scope.REQUEST');
            return this.clientInstance;
        }

        this.logger.log('initialising new supabase client for new Scope.REQUEST');

        this.clientInstance = createClient(
            this.configService.get('SUPABASE_URL'),
            this.configService.get('SUPABASE_KEY'),
            {
                auth: {
                    autoRefreshToken: true, 
                    detectSessionInUrl: false,
                },
            },
        );

        return this.clientInstance;
    }
}