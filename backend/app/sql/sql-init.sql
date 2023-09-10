
-- Create the Tenant1 database
CREATE DATABASE tenant1;
\c tenant1;

-- Create tables in Tenant1 database
CREATE TABLE IF NOT EXISTS public."MaintenanceObject"
(
    id uuid NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "MaintenanceObject_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MaintenanceObject"
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public."MaintenanceReport"
(
    id uuid NOT NULL,
    year integer NOT NULL,
    CONSTRAINT "MaintenanceReport_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MaintenanceReport"
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public."MaintenanceReportEntry"
(
    id uuid NOT NULL,
    maintainer text COLLATE pg_catalog."default" NOT NULL,
    date text COLLATE pg_catalog."default" NOT NULL,
    "maintenanceReportId" uuid,
    "maintenanceObjectId" uuid NOT NULL,
    CONSTRAINT "MaintenanceReportEntry_pkey" PRIMARY KEY (id),
    CONSTRAINT "MaintenanceReportEntry_maintenanceObjectId_fkey" FOREIGN KEY ("maintenanceObjectId")
        REFERENCES public."MaintenanceObject" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT "MaintenanceReportEntry_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId")
        REFERENCES public."MaintenanceReport" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MaintenanceReportEntry"
    OWNER to postgres;

INSERT INTO public."MaintenanceObject" VALUES ('e82e9f53-2476-41c2-9f9e-4a6ad532e1fd', 'Pumpe');
INSERT INTO public."MaintenanceObject" VALUES ('83c96542-cb9e-4919-aace-97008f7d0519', 'Ventil');
INSERT INTO public."MaintenanceObject" VALUES ('35e7962f-602a-4c68-a074-cbd2ad709997', 'Raum-Controller');

INSERT INTO public."MaintenanceReport" VALUES ('9c896e11-930f-48f6-80db-0db1a893557c', 2022);
INSERT INTO public."MaintenanceReport" VALUES ('4aa437b6-067f-485d-80d4-a8d97c94f7da', 2021);

INSERT INTO public."MaintenanceReportEntry" VALUES ('a2d2b3f1-0c1c-410e-bbb7-cbca8010fb27', 'Manuel', '21-07-2022', '9c896e11-930f-48f6-80db-0db1a893557c', '35e7962f-602a-4c68-a074-cbd2ad709997');
INSERT INTO public."MaintenanceReportEntry" VALUES ('5302f6c5-e904-4900-b4f9-501c8b853491', 'Christian', '21-07-2022', '9c896e11-930f-48f6-80db-0db1a893557c', '83c96542-cb9e-4919-aace-97008f7d0519');
INSERT INTO public."MaintenanceReportEntry" VALUES ('32a2e8b3-0661-4662-96bc-0ec94013aa5e', 'Ann-Marie', '29-04-2021', '4aa437b6-067f-485d-80d4-a8d97c94f7da', 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fd');
INSERT INTO public."MaintenanceReportEntry" VALUES ('0204ab4e-bc73-458e-a282-0fffdb756ac7', 'Manfred', '01-05-2021', '4aa437b6-067f-485d-80d4-a8d97c94f7da', '35e7962f-602a-4c68-a074-cbd2ad709997');

-- Create the Tenant1 database
CREATE DATABASE tenant2;
\c tenant2;

-- Create tables in Tenant1 database
CREATE TABLE IF NOT EXISTS public."MaintenanceObject"
(
    id uuid NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "MaintenanceObject_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MaintenanceObject"
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public."MaintenanceReport"
(
    id uuid NOT NULL,
    year integer NOT NULL,
    CONSTRAINT "MaintenanceReport_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MaintenanceReport"
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public."MaintenanceReportEntry"
(
    id uuid NOT NULL,
    maintainer text COLLATE pg_catalog."default" NOT NULL,
    date text COLLATE pg_catalog."default" NOT NULL,
    "maintenanceReportId" uuid,
    "maintenanceObjectId" uuid NOT NULL,
    CONSTRAINT "MaintenanceReportEntry_pkey" PRIMARY KEY (id),
    CONSTRAINT "MaintenanceReportEntry_maintenanceObjectId_fkey" FOREIGN KEY ("maintenanceObjectId")
        REFERENCES public."MaintenanceObject" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT "MaintenanceReportEntry_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId")
        REFERENCES public."MaintenanceReport" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."MaintenanceReportEntry"
    OWNER to postgres;

INSERT INTO public."MaintenanceObject" VALUES ('35e7962f-602a-4c68-a074-cbd2ad709997', 'Außenluftklappe');
INSERT INTO public."MaintenanceObject" VALUES ('83c96542-cb9e-4919-aace-97008f7d0519', 'Temp Sensor');
INSERT INTO public."MaintenanceObject" VALUES ('e82e9f53-2476-41c2-9f9e-4a6ad532e1fd', 'Schaltschrank');

INSERT INTO public."MaintenanceReport" VALUES ('9c896e11-930f-48f6-80db-0db1a893557c', 2022);
INSERT INTO public."MaintenanceReport" VALUES ('4aa437b6-067f-485d-80d4-a8d97c94f7da', 2021);

INSERT INTO public."MaintenanceReportEntry" VALUES ('a2d2b3f1-0c1c-410e-bbb7-cbca8010fb27', 'Manuel', '21-07-2022', '9c896e11-930f-48f6-80db-0db1a893557c', '35e7962f-602a-4c68-a074-cbd2ad709997');
INSERT INTO public."MaintenanceReportEntry" VALUES ('5302f6c5-e904-4900-b4f9-501c8b853491', 'Christian', '21-07-2022', '9c896e11-930f-48f6-80db-0db1a893557c', '83c96542-cb9e-4919-aace-97008f7d0519');
INSERT INTO public."MaintenanceReportEntry" VALUES ('32a2e8b3-0661-4662-96bc-0ec94013aa5e', 'Ann-Marie', '29-04-2021', '4aa437b6-067f-485d-80d4-a8d97c94f7da', 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fd');
INSERT INTO public."MaintenanceReportEntry" VALUES ('0204ab4e-bc73-458e-a282-0fffdb756ac7', 'Manfred', '01-05-2021', '4aa437b6-067f-485d-80d4-a8d97c94f7da', '35e7962f-602a-4c68-a074-cbd2ad709997');