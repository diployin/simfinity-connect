import { Route, Switch } from 'wouter';
import { AccountLayout } from '@/components/layout/AccountLayout';
import Profile from '@/pages/Profile';
import MyESIMs from '@/pages/MyESIMs';
import MyOrders from '@/pages/MyOrders';
import Referrals from '@/pages/Referrals';
import AccountSupport from '@/pages/AccountSupport';
import KYCSubmission from '@/pages/KYCSubmission';

export function AccountShell() {
  return (
    <AccountLayout>
      <Switch>
        <Route path="/account/profile" component={Profile} />
        <Route path="/account/esims" component={MyESIMs} />
        <Route path="/account/orders" component={MyOrders} />
        <Route path="/account/referrals" component={Referrals} />
        <Route path="/account/support" component={AccountSupport} />
        <Route path="/account/kyc" component={KYCSubmission} />
      </Switch>
    </AccountLayout>
  );
}
