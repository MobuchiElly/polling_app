import {Suspense} from 'react';
import VerifyEmailComp from '@/components/auth/Verify-Email';

const page = () => {
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <VerifyEmailComp />
    </Suspense>
  );
}

export default page;