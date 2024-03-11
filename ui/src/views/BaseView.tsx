import {Navigate, Outlet} from 'react-router-dom';
import {useNavigate, useMatches} from 'react-router-dom';

import {Breadcrumbs, Navbar} from '@maykin-ui/admin-ui/components';
import {ConfigContext, NavigationContext} from '@maykin-ui/admin-ui/contexts';
import {getSiteTree} from "../utils/siteTree.tsx";
import {useAuth} from "../components/Auth/Auth.tsx";
import {formatMessage} from "@maykin-ui/admin-ui";

export default function BaseView() {
    const matches = useMatches()
    const navigate = useNavigate();
    const auth = useAuth();
    const siteTreeOptions = getSiteTree(navigate, auth);

    const breadcrumbs = matches.filter(m => m.handle).map((match) => {
        const handle = match.handle as Record<string, string>
        return ({
            href: match.pathname,
            label: formatMessage(handle.labelTemplate || '', match.params as Record<string, string>)
        });
    });

    if (matches[matches.length - 1]?.pathname === '/') {
        return <Navigate to="/zaaktypen/"/>
    }

    return (
        <ConfigContext.Provider value={{debug: false}}>
            <NavigationContext.Provider value={{
                primaryNavigation: <Navbar items={siteTreeOptions.map(({href, Icon, label, onClick}) =>
                    ({
                        children: <>{Icon}{label}</>,
                        variant: href ? 'transparent' : 'primary',
                        onClick: onClick
                    }))}>
                </Navbar>,
                breadcrumbs: breadcrumbs.length > 1 ? <Breadcrumbs items={breadcrumbs}/> : undefined
            }}>
                <Outlet/>
            </NavigationContext.Provider>
        </ConfigContext.Provider>
    );
}
