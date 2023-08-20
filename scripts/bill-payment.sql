-- Table: public.bill_checks

DROP TABLE IF EXISTS public.bill_checks;

CREATE TABLE IF NOT EXISTS public.bill_checks
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    billcode character varying(120) NOT NULL,
    service_code character varying(100) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bill_checks_pkey PRIMARY KEY (id)
)

-- Table: public.bill_payments

DROP TABLE IF EXISTS public.bill_payments;

CREATE TABLE IF NOT EXISTS public.bill_payments
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    billcode character varying(120) NOT NULL,
    service_code character varying(100) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    amount integer DEFAULT 0,
    bill_details jsonb NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bill_payments_pkey PRIMARY KEY (id)
)