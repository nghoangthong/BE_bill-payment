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
    bill_status character varying(30) NOT NULL,
    billcode character varying(120) NOT NULL,
    service_code character varying(100) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    amount integer DEFAULT 0,
    bill_details jsonb NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bill_payments_pkey PRIMARY KEY (id)
)

-- Table: public.payment_histories

CREATE TABLE IF NOT EXISTS public.payment_histories
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    bill_status character varying(30) NOT NULL,
    billcode character varying(120) NOT NULL,
    service_code character varying(100) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    amount integer DEFAULT 0,
    bill_details jsonb NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_histories_pkey PRIMARY KEY (id)
)

-- Table: public.transaction

DROP TABLE IF EXISTS public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    bill_status character varying(30) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT transactions_pkey PRIMARY KEY (id)
)