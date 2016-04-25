/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var findOne, find, create, update, remove, getDashboardsFromRegistry;
var utils = require('/modules/utils.js');

(function () {
    var dir = '/store/';

    var utils = require('/modules/utils.js');

    var assetsDir = function (ctx, type) {
        var carbon = require('carbon');
        var config = require('/configs/designer.json');
        var domain = config.shareStore ? carbon.server.superTenant.domain : ctx.domain;
        return dir + domain + '/' + type + '/';
    };

    var registryPath = function (id) {
        var path = '/_system/config/ues/dashboards';
        return id ? path + '/' + id : path;
    };

    getDashboardsFromRegistry = function (start, count) {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var registry = new carbon.registry.Registry(server, {
            system: true
        });
        var dashboards = registry.content(registryPath(), {
            start: start,
            count: count
        });

        return dashboards;
    };

    var findDashboards = function (ctx, type, query, start, count) {
        if (!ctx.username) {
            return [];
        }

        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var registry = new carbon.registry.Registry(server, {
            system: true
        });
        var um = new carbon.user.UserManager(server, ctx.tenantId);
        var userRoles = um.getRoleListOfUser(ctx.username);

        var dashboards = getDashboardsFromRegistry(start, count);
        if (!dashboards) {
            return [];
        }
        var allDashboards = [];
        dashboards.forEach(function (dashboard) {
            allDashboards.push(JSON.parse(registry.content(dashboard)));
        });

        var userDashboards = [];
        allDashboards.forEach(function (dashboard) {
            var permissions = dashboard.permissions,
                data = {
                    id: dashboard.id,
                    title: dashboard.title,
                    description: dashboard.description,
                    pagesAvailable: dashboard.pages.length > 0,
                    editable: true
                };

            if (utils.allowed(userRoles, permissions.editors)) {
                userDashboards.push(data);
                return;
            }
            if (utils.allowed(userRoles, permissions.viewers)) {
                data.editable = false;
                userDashboards.push(data);
            }
        });
        return userDashboards;
    };

    findOne = function (type, id) {
        var ctx = utils.currentContext();
        var parent = assetsDir(ctx, type);
        var file = new File(parent + id);
        if (!file.isExists()) {
            return null;
        }
        file = new File(file.getPath() + '/' + type + '.json');
        if (!file.isExists()) {
            return null;
        }
        file.open('r');
        var asset = JSON.parse(file.readAll());
        file.close();
        return asset;
    };

    find = function (type, query, start, count) {
        var ctx = utils.currentContext();
        if (type === 'dashboard') {
            return findDashboards(ctx, type, query, start, count);
        }
        var parent = new File(assetsDir(ctx, type));
        var assetz = parent.listFiles();
        var assets = [];
        query = query ? new RegExp(query, 'i') : null;
        assetz.forEach(function (file) {
            if (!file.isDirectory()) {
                return;
            }
            file = new File(file.getPath() + '/' + type + '.json');
            if (file.isExists()) {
                file.open('r');
                var asset = JSON.parse(file.readAll());
                if (!query) {
                    assets.push(asset);
                    file.close();
                    return;
                }
                var title = asset.title || '';
                if (!query.test(title)) {
                    file.close();
                    return;
                }
                assets.push(asset);
                file.close();
            }
        });

        var end = start + count;
        end = end > assets.length ? assets.length : end;
        assets = assets.slice(start, end);
        return assets;
    };

    /*create = function (type, asset) {
     var user = currentContext();
     var parent = new File(assetsDir(user, type));
     var file = new File(asset.id, parent);
     file.mkdir();
     file = new File(type + '.json', file);
     file.open('w');
     file.write(JSON.stringify(asset));
     file.close();
     };*/

    update = function (asset) {

    };

    remove = function (id) {

    };
}());