import * as React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { connect } from 'react-redux';
import { changeRoute, changeRouteHeading, toggleMenu } from '../../actions/app';

import {
  MenuWrapper,
  SubListItemStyled,
  ListItem,
  HeaderList,
  HeadingWrapper,
  ItemHeading,
} from './styled';

export interface Entry {
  name: string;
  route: string;
  children?: any[];
  open?: boolean;
}

const equal = (x, y) => JSON.stringify(x) === JSON.stringify(y);

interface HeadingProps {
  type?: string;
  heading: any[];
  routeHeadingActive: string;
  handleChangeRouteHeading: Function;
  toggleMenu: Function;
}

const Heading: React.FC<HeadingProps> = ({
  type,
  heading,
  routeHeadingActive,
  handleChangeRouteHeading,
  toggleMenu
}) => {
  return(
  <HeadingWrapper type={type}>
    {heading.filter(({ depth }) => depth === 2).map((node, key) => (
        <ItemHeading key={key}
          active={routeHeadingActive.replace('#', '') === node.slug}
          href={`#${node.slug}`}
          onClick={() => {
            handleChangeRouteHeading(node.slug);
            window.innerWidth <= 1200 && toggleMenu();
          }}
        >
          {node.value}
        </ItemHeading>
    ))}
    </HeadingWrapper>
  );
};

export const SubMenu = ({
  entry,
  routeActive,
  routeHeadingActive,
  handleChangeRoute,
  handleChangeRouteHeading,
  toggleMenu
}) => {

  const [ open, setOpen ] = useState(true);
  const { children, name } = entry;
  return (
    <React.Fragment>
      <ListItem onClick={(event) => {
        event.preventDefault();
        setOpen(!open)
      }}>
        <HeaderList href="#" open={open}>
          {name}
          <ChevronDown size={15} style={{marginRight: 10}} />
        </HeaderList>
      </ListItem>
      {open && (
        <MenuWrapper>
          {children.map((child, key) => {
            const { name, route, heading } = child;
            const active = equal(route, routeActive);
            return (
              <React.Fragment key={key}>
                <SubListItemStyled
                  onClick={() => {
                    handleChangeRoute(route);
                    window.innerWidth <= 1200 && toggleMenu();
                  }} 
                  active={active}
                >
                  <NavLink exact to={route}>{name}</NavLink>
            
                </SubListItemStyled>
                {(active && heading.length > 1) && (
                  <Heading
                    toggleMenu={toggleMenu}
                    type={"sub"}
                    handleChangeRouteHeading={handleChangeRouteHeading}
                    heading={heading}
                    routeHeadingActive={routeHeadingActive}
                  />
                )}
              </React.Fragment>
            );
          })}
      </MenuWrapper>
      )}
    </React.Fragment>
  )
};

const MenuItem = ({
  routeActive,
  entry,
  handleChangeRoute,
  toggleMenu,
  routeHeadingActive,
  handleChangeRouteHeading,
}) => {
  const { route, name, heading } = entry;
  const active = equal(route, routeActive);
  return (
    <>
      <ListItem active={active} onClick={() => {
        handleChangeRoute(route);
        window.innerWidth <= 1200 && toggleMenu();
      }}>
        <NavLink exact to={route}>{name}</NavLink>
      </ListItem>
      {(active && heading.length > 1) && (
        <Heading
          toggleMenu={toggleMenu}
          routeHeadingActive={routeHeadingActive}
          handleChangeRouteHeading={handleChangeRouteHeading}
          heading={heading}
        />
      )}
    </>
  )
};

const Menu = ({
  entries,
  handleChangeRoute,
  routeActive,
  toggleMenu,
  routeHeadingActive,
  handleChangeRouteHeading
}) => {
  return (
    <MenuWrapper>
      {entries.map((entry: Entry, key) => {
        const props = {
          routeActive,
          routeHeadingActive,
          entry,
          handleChangeRouteHeading,
          handleChangeRoute,
          toggleMenu,
        };
        return (
          <React.Fragment key={key}>
            {entry.children
              ? <SubMenu {...props } />
              : <MenuItem {...props } />}
          </React.Fragment>
        );
      })}
    </MenuWrapper>
  );
};

const mapStateToProps = (state) => ({
  routeActive: state.route,
  routeHeadingActive: state.routeHeading
});

const mapDispatchToProps = (dispatch) => ({
  handleChangeRoute: (route: string) => {
    dispatch(changeRoute(route));
    dispatch(changeRouteHeading(''));
  },
  handleChangeRouteHeading: (route: string) => {
    dispatch(changeRouteHeading(route));
  },
  toggleMenu: () => {
    dispatch(toggleMenu());
  }
});

const MenuHoc = connect(mapStateToProps, mapDispatchToProps)(Menu);

export { MenuHoc as Menu };