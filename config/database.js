const { Pool } = require('pg');
// your credentials
DATABASE_URL = 'postgres://postgres:Pakim2541@127.0.0.1:5432/testdb';

const pool = new Pool({
  connectionString: DATABASE_URL
});

pool.query(`
    CREATE TABLE IF NOT EXISTS public.customer (
        customer_code character varying(6) PRIMARY KEY,
        name character varying(30) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS public.department (
        department_code character varying(3) PRIMARY KEY,
        name character varying(20) NOT NULL,
        phone character varying(10)
    );
    CREATE TABLE IF NOT EXISTS public.staff (
        staff_code character varying(3) PRIMARY KEY,
        name character varying(30),
        works_for_dep_code character varying(3) NOT NULL,
        CONSTRAINT works_for_dep_code_fkey FOREIGN KEY (works_for_dep_code) REFERENCES public.department(department_code)
    );
    CREATE TABLE IF NOT EXISTS public.product_type (
        type_name character varying(20) PRIMARY KEY
    );
    CREATE TABLE IF NOT EXISTS public.supplier (
        supplier_code character varying(6) PRIMARY KEY,
        name character varying(30) NOT NULL,
        phone character varying(12),
        email text
    );
    CREATE TABLE IF NOT EXISTS public.model (
        model_code character varying(10) PRIMARY KEY,
        name character varying(50) NOT NULL,
        width numeric(4,1),
        height numeric(4,1),
        depth numeric(4,1),
        weight numeric(4,1),
        from_supplier_code character varying(6) NOT NULL,
        is_product_type_name character varying(20) NOT NULL,
        CONSTRAINT from_supplier_code_fkey FOREIGN KEY (from_supplier_code) REFERENCES public.supplier(supplier_code) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT is_product_type_name_fkey FOREIGN KEY (is_product_type_name) REFERENCES public.product_type(type_name) ON UPDATE CASCADE ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS public.bulk (
        bulk_code character varying(6) PRIMARY KEY,
        date_in timestamp(4) with time zone NOT NULL,
        price_per_unit integer NOT NULL,
        of_model_code character varying(10),
        CONSTRAINT of_model_code_fkey FOREIGN KEY (of_model_code) REFERENCES public.model(model_code) ON UPDATE CASCADE ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS public.branch (
        branch_code character varying(6) PRIMARY KEY,
        name character varying(30) NOT NULL,
        address text NOT NULL,
        owner_customer_code character varying(6) NOT NULL,
        CONSTRAINT owner_customer_code_fkey FOREIGN KEY (owner_customer_code) REFERENCES public.customer(customer_code) ON UPDATE CASCADE ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS public.item (
        serial_no character varying(20) PRIMARY KEY,
        is_broken boolean NOT NULL,
        status character varying(15) NOT NULL,
        remarks text,
        from_bulk_code character varying(6) NOT NULL,
        reserved_branch_code character varying(6),
        CONSTRAINT from_bulk_code_fkey FOREIGN KEY (from_bulk_code) REFERENCES public.bulk(bulk_code) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT reserved_branch_code_fkey FOREIGN KEY (reserved_branch_code) REFERENCES public.branch(branch_code)
    );
    CREATE TABLE IF NOT EXISTS public.return_history (
        return_datetime timestamp(6) with time zone NOT NULL,
        serial_no character varying(20) NOT NULL,
        PRIMARY KEY (return_datetime, serial_no),
        CONSTRAINT serial_no_fkey FOREIGN KEY (serial_no) REFERENCES public.item(serial_no)
    );
    CREATE TABLE IF NOT EXISTS public.withdrawal (
        id integer PRIMARY KEY,
        date timestamp(4) with time zone NOT NULL,
        remarks text,
        for_branch_code character varying(6),
        for_department_code character varying(3),
        return_by date,
        install_date date,
        created_by_staff_code character varying(6) NOT NULL,
        type character varying(15) NOT NULL,
        status character varying(10) NOT NULL,
        CONSTRAINT for_branch_code_fkey FOREIGN KEY (for_branch_code) REFERENCES public.branch(branch_code),
        CONSTRAINT for_department_code_fkey FOREIGN KEY (for_department_code) REFERENCES public.department(department_code)
    );
    CREATE TABLE IF NOT EXISTS public.withdrawal_has_item (
        withdrawal_id integer NOT NULL,
        serial_no character varying(20) NOT NULL,
        PRIMARY KEY (withdrawal_id, serial_no),
        CONSTRAINT serial_no_fkey FOREIGN KEY (serial_no) REFERENCES public.item(serial_no),
        CONSTRAINT withdrawal_id_fkey FOREIGN KEY (withdrawal_id) REFERENCES public.withdrawal(id)
    );
`);

module.exports = pool