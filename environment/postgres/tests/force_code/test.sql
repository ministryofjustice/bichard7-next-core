DO
$$
    DECLARE
        force_code_result SMALLINT;
    BEGIN
        
        -- Test extracting the code
        SELECT br7own.force_code('05AB') INTO force_code_result;
        ASSERT (force_code_result = 5), 'Force code was not extracted properly';

        -- Test extracting an invalid code as null
        SELECT br7own.force_code('XYAB') INTO force_code_result;
        ASSERT (force_code_result IS NULL), 'Force code was not extracted properly';

        RAISE NOTICE 'Test passed';
    END
$$;
