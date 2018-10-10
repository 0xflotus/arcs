// @license
// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt

'use strict';

defineParticle(({DomParticle, log, html}) => {
  const host = 'arcs-launcher';
  const template = html`

<div ${host}>
  <style>
    [${host}] cx-tabs {
      border-bottom: 1px solid #ccc;
      justify-content: center;
    }
    [${host}] cx-tab {
      font-weight: 500;
      font-size: 14px;
      letter-spacing: .25px;
      color: #999;
    }
    [${host}] cx-tab[selected] {
      color: #111;
    }
    [${host}] [columns] {
      display: flex;
      padding: 16px;
      /* temporary: pending responsiveness */
      max-width: 600px;
      margin: 0 auto;
    }
    [${host}] [chip] {
      font-family: 'Google Sans';
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 16px 16px 16px 16px;
      margin: 0 4px 8px 4px;
      font-size: 18px;
      color: whitesmoke;
      border-radius: 8px;
    }
    [${host}] a {
      display: block;
      color: inherit;
      text-decoration: none;
    }
    [${host}] [hovering] {
      visibility: hidden;
    }
    [${host}] [chip]:hover [hovering] {
      visibility: visible;
    }
    [${host}] [share] {
      display: flex;
      align-items: center;
      margin-top: 32px;
    }
    [${host}] icon {
      margin-right: 16px;
    }
    [${host}] icon:last-of-type {
      margin-right: 0;
    }
  </style>

  <cx-tabs on-select="onTabSelect">
    <cx-tab>All</cx-tab>
    <cx-tab selected>Recent</cx-tab>
    <cx-tab>Starred</cx-tab>
    <cx-tab>Shared</cx-tab>
  </cx-tabs>
  <div columns>
    <div style="flex: 1;">{{columnA}}</div>
    <div style="flex: 1;">{{columnB}}</div>
  </div>
</div>

<template column>
  <div chip xen:style="{{chipStyle}}">
    <a href="{{href}}" trigger$="{{description}}">
      <div description title="{{description}}" unsafe-html="{{blurb}}"></div>
      <div style="flex: 1;"></div>
    </a>
    <div share>
      <icon key="{{arcId}}" on-click="onStar">{{starred}}</icon>
      <icon key="{{arcId}}" title="{{tip}}" on-click="onShare">{{sharing}}</icon>
      <span style="flex: 1;"></span>
      <icon hovering key="{{arcId}}" on-click="onDelete">delete_forever</icon>
    </div>
  </div>
</template>

`;

  return class extends DomParticle {
    get template() {
      return template;
    }
    _getInitialState() {
      return {
        selected: 1
      };
    }
    willReceiveProps({arcs}) {
      const collation = this.collateItems(arcs);
      this.setState(collation);
    }
    shouldRender(props, state) {
      return Boolean(state.items);
    }
    render(props, {items, shared, starred, recent, selected}) {
      const columns = [[], []];
      const chosen = [items, recent, starred, shared][selected || 0];
      chosen.sort((a, b) => a.touched > b.touched ? -1 : a.touched < b.touched ? 1 : 0);
      const method = ['ltr', 'ttb'][0];
      if (method === 'ltr') {
        // method 1: left-to-right, top-to-bottom
        chosen.forEach((item, i) => {
          columns[i % 2].push(item);
        });
      } else {
        // method 2: top-to-bottom, left-to-right
        const pivot = chosen.length / 2;
        chosen.forEach((item, i) => {
          columns[i >= pivot ? 1 : 0].push(item);
        });
      }
      return {
        columnA: {
          $template: 'column',
          models: columns[0],
        },
        columnB: {
          $template: 'column',
          models: columns[1],
        }
      };
    }
    collateItems(arcs) {
      const result = {
        items: [],
        shared: [],
        starred: [],
        recent: [],
      };
      const byTime = arcs.slice().sort((a, b) => a.touched > b.touched ? -1 : a.touched < b.touched ? 1 : 0);
      byTime.forEach((a, i) => {
        if (a.description && !a.deleted) {
          let model = this.renderArc(a);
          result.items.push(model);
          if (a.starred) {
            result.starred.push(model);
          }
          if (a.share > 1) {
            result.shared.push(model);
          }
          if (result.recent.length < 6) {
            result.recent.push(model);
          }
        }
      });
      return result;
    }
    renderArc(arc) {
      // massage the description
      //const blurb = arc.description.length > 70 ? arc.description.slice(0, 70) + '...' : arc.description;
      const blurb = arc.description;
      const chipStyle = {
        backgroundColor: arc.bg || arc.color || 'gray',
        color: arc.bg ? arc.color : 'white',
      };
      const share = Math.max((arc.share || 0) - 1, 0);
      //const shares = ['share', 'account_circle', 'people'];
      const shares = ['stop_screen_share', 'screen_share', 'people'];
      const tips = ['Arc is private', 'Arc is part of my Profile', 'Arc is shared with my Friends'];
      // populate a render model
      return {
        arcId: arc.id,
        key: arc.key,
        href: arc.href,
        blurb,
        description: arc.description,
        icon: arc.icon,
        starred: arc.starred ? 'star' : 'star_border',
        chipStyle,
        sharing: shares[share],
        tip: tips[share],
        touched: arc.touched
      };
    }
    findArc(id) {
      const arc = this._props.arcs.find(a => a.id === id);
      if (!arc) {
        log(`Couldn't find arc[${id}].`);
      }
      return arc;
    }
    onTabSelect(e) {
      const selected = e.data.value;
      this.setState({selected});
    }
    onDelete(e) {
      const arc = this.findArc(e.data.key);
      if (arc) {
        this.mutateEntity('arcs', arc, arc => arc.deleted = true);
      }
    }
    onStar(e) {
      const arc = this.findArc(e.data.key);
      if (arc) {
        this.mutateEntity('arcs', arc, arc => arc.starred= !arc.starred);
      }
    }
    onShare(e) {
      const arc = this.findArc(e.data.key);
      if (arc) {
        this.mutateEntity('arcs', arc, arc => arc.share = ((Math.max(arc.share || 0, 1)) % 3) + 1);
      }
    }
    mutateEntity(handleName, entity, mutator) {
      const handle = this.handles.get(handleName);
      handle.remove(entity);
      mutator(entity);
      handle.store(entity);
      log(`mutated entity [${entity.id}]`);
    }
  };
});