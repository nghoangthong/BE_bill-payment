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
    bill_number character varying(100) NOT NULL
    partner_ref_id character varying(180) NOT NULL,
    amount integer DEFAULT 0,
    bill_details jsonb NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bill_payments_pkey PRIMARY KEY (id)
)


DROP TABLE IF EXISTS public.transactions_histories;

CREATE TABLE IF NOT EXISTS public.transactions_histories
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    bill_status character varying(30) NOT NULL,
    partner_ref_id character varying(180) NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT transactions_histories_pkey PRIMARY KEY (id)
)

async function updateBillStatusByPartnerRefId(partnerRefId, newStatus) {
  const query = `
    UPDATE public.bill_payments
    SET bill_status = $1
    WHERE partner_ref_id = $2;
  `;

  const values = [newStatus, partnerRefId];

  try {
    const client = await pool.connect();
    await client.query(query, values);
    client.release();
    console.log(`Updated bill_status for partner_ref_id ${partnerRefId} to ${newStatus}`);
  } catch (error) {
    console.error('Error updating bill_status:', error);
  }
}

async function getBillStatusByPartnerRefId(partnerRefId) {
  try {
    const query = {
      text: 'SELECT bill_status FROM bill_payments WHERE partner_ref_id = $1 LIMIT 1',
      values: [partnerRefId],
    };

    const result = await pool.query(query);
    
    // Nếu không tìm thấy dòng phù hợp, trả về null hoặc giá trị mặc định khác
    if (result.rowCount === 0) {
      return null;
    }

    // Lấy giá trị bill_status từ kết quả truy vấn
    const { bill_status } = result.rows[0];
    
    return bill_status;
  } catch (error) {
    console.error('Lỗi trong quá trình truy vấn cơ sở dữ liệu:', error);
    throw error;
  }
}