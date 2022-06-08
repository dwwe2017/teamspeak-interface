PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS `{PREFIX}api`;
CREATE TABLE IF NOT EXISTS `{PREFIX}api` (
  `id` int(11) NOT NULL,
  `reseller_id` int(11) DEFAULT NULL,
  `label` varchar(255) NOT NULL DEFAULT '',
  `client` varchar(510) NOT NULL DEFAULT '',
  `secret` varchar(510) NOT NULL DEFAULT '',
  `restricted_ip` varchar(255) NOT NULL DEFAULT '',
  `limits` longtext NOT NULL,
  FOREIGN KEY (`reseller_id`) REFERENCES `{PREFIX}resellers` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_FADB47B391E6A19D` (`reseller_id`)
);

DROP TABLE IF EXISTS `{PREFIX}config`;
CREATE TABLE IF NOT EXISTS `{PREFIX}config` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'Tea(m)speak Interface',
  `shortcut` varchar(11) NOT NULL DEFAULT 'TSI',
  `version` varchar(55) NOT NULL DEFAULT '1.2.0',
  `serial_key` varchar(510) DEFAULT NULL,
  `last_update` datetime DEFAULT NULL,
  `last_update_check` double DEFAULT NULL,
  `auto_generate_proxy_classes` int(1) NOT NULL DEFAULT '0',
  `cache_driver` varchar(25) NOT NULL DEFAULT 'files',
  `cache_type` varchar(25) NOT NULL DEFAULT 'dedicated',
  `cache_lifetime` int(11) NOT NULL DEFAULT '3600',
  `created` datetime DEFAULT NULL,
  `icon_pkg` varchar(510) NOT NULL DEFAULT 'images/pkg-default',
  `intelli_multiling` int(1) NOT NULL DEFAULT '0',
  `options` longtext DEFAULT NULL,
  `db_converted` tinyint(1) NOT NULL DEFAULT '0',
  `timezone` varchar(55) NOT NULL DEFAULT 'Europe/Berlin',
  `cronjob_ajax` int(1) NOT NULL DEFAULT '0',
  `cronjob_crontab` int(1) NOT NULL DEFAULT '0',
  `log_level` varchar(11) NOT NULL DEFAULT 'WARNING',
  `date_format` varchar(11) NOT NULL DEFAULT 'Y-m-d',
  `maintenance` varchar(510) DEFAULT NULL,
  `base_update_url` varchar(110) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `{PREFIX}config` (`id`, `name`, `shortcut`, `version`, `serial_key`, `last_update`, `last_update_check`, `auto_generate_proxy_classes`, `cache_driver`, `cache_type`, `cache_lifetime`, `created`, `icon_pkg`, `intelli_multiling`, `options`, `db_converted`, `timezone`, `cronjob_ajax`, `cronjob_crontab`, `log_level`, `date_format`, `maintenance`) VALUES
  (1, 'Tea(m)speak Interface', 'TSI', '{VERSION}', '{SERIAL_KEY}', CURRENT_TIMESTAMP, NULL, 0, 'files', 'dedicated', 3600, CURRENT_TIMESTAMP, '{ICON_PKG}', 0, NULL, 0, '{TIMEZONE}', 0, 0, 'WARNING', '{DATE_FORMAT}', NULL);

DROP TABLE IF EXISTS `{PREFIX}cronjob`;
CREATE TABLE IF NOT EXISTS `{PREFIX}cronjob` (
  `id` int(11) NOT NULL,
  `namespace` varchar(110) DEFAULT NULL,
  `class` varchar(55) DEFAULT NULL,
  `method` varchar(55) DEFAULT NULL,
  `expression` varchar(510) NOT NULL DEFAULT '*/15 * * * *',
  `description` varchar(510) NOT NULL DEFAULT '',
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

INSERT INTO `{PREFIX}cronjob` (`id`, `namespace`, `class`, `method`, `expression`, `description`, `active`) VALUES
  (1, 'Cronjobs', 'Maincore', 'clearTempFiles', '@daily', 'Deletes all temporary files', 1),
  (2, 'Cronjobs', 'Maincore', 'clearStylesheetCache', '@daily', 'Clears the stylesheet cache', 1),
  (3, 'Cronjobs', 'Maincore', 'protStatsInstance', '*/30 * * * *', 'Collects information about instances for the statistics', 1),
  (4, 'Cronjobs', 'Maincore', 'protStatsServer', '*/30 * * * *', 'Collects information about virtual servers for statistics', 1),
  (5, 'Cronjobs', 'Maincore', 'createSnapshots', '@weekly', 'Create snapshots. In crontab mode of all virtual servers, in Ajax mode from the currently selected one', 1);

DROP TABLE IF EXISTS `{PREFIX}extensions`;
CREATE TABLE IF NOT EXISTS `{PREFIX}extensions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `shortcut` varchar(11) NOT NULL DEFAULT '',
  `description` varchar(510) NOT NULL DEFAULT '',
  `version` varchar(55) NOT NULL DEFAULT '0.0.0',
  `serial_key` varchar(510) NOT NULL DEFAULT '',
  `license_uri` varchar(255) NOT NULL DEFAULT '',
  `update_uri` varchar(255) NOT NULL DEFAULT '',
  `files` longtext NOT NULL DEFAULT '',
  `dir` varchar(255) NOT NULL DEFAULT '',
  `init_class` varchar(255) NOT NULL DEFAULT '',
  `init_method` varchar(255) NOT NULL DEFAULT '',
  `menu_class` varchar(255) NOT NULL DEFAULT '',
  `serverlist_option` int(1) NOT NULL DEFAULT '0',
  `last_update` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `icon_pkg` varchar(510) NOT NULL DEFAULT 'default',
  `settings` longtext DEFAULT NULL,
  `type` varchar(55) NOT NULL DEFAULT 'servers',
  `sort_id` int(11) NOT NULL DEFAULT '0',
  `enabled` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{PREFIX}instances`;
CREATE TABLE IF NOT EXISTS `{PREFIX}instances` (
  `id` int(11) NOT NULL,
  `reseller_id` int(11) DEFAULT NULL,
  `basis` varchar(11) NOT NULL DEFAULT 'ts3',
  `label` varchar(210) NOT NULL DEFAULT '',
  `server_ip` varchar(255) NOT NULL DEFAULT '',
  `query_port` int(11) NOT NULL DEFAULT '10011',
  `serveradmin` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `athp_link` varchar(255) NOT NULL DEFAULT '',
  `tls` int(11) NOT NULL DEFAULT '0',
  `invoker` varchar(2) NOT NULL DEFAULT 'SA',
  `custom_icon` longtext DEFAULT NULL,
  `last_perm_import` datetime DEFAULT NULL,
  FOREIGN KEY (`reseller_id`) REFERENCES `{PREFIX}resellers` (`id`) ON DELETE SET NULL,
  PRIMARY KEY (`id`)
  -- KEY `IDX_EB01953991E6A19D` (`reseller_id`)
);

DROP TABLE IF EXISTS `{PREFIX}instance_perms`;
CREATE TABLE IF NOT EXISTS `{PREFIX}instance_perms` (
  `id` int(11) NOT NULL,
  `permcatid` int(11) DEFAULT NULL,
  `instance_id` int(11) DEFAULT NULL,
  `permid` int(11) NOT NULL DEFAULT '0',
  `permname` varchar(255) NOT NULL DEFAULT '',
  `permdesc` varchar(255) DEFAULT NULL,
  `permgrant` bigint(20) NOT NULL DEFAULT '0',
  FOREIGN KEY (`instance_id`) REFERENCES `{PREFIX}instances` (`id`),
  FOREIGN KEY (`permcatid`) REFERENCES `{PREFIX}instance_perm_cats` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_97ABD78DB12C8CFA` (`permcatid`),
  -- KEY `IDX_97ABD78D3A51721D` (`instance_id`)
);

DROP TABLE IF EXISTS `{PREFIX}instance_perm_cats`;
CREATE TABLE IF NOT EXISTS `{PREFIX}instance_perm_cats` (
  `id` int(11) NOT NULL,
  `instance_id` int(11) DEFAULT NULL,
  `permcatid` int(11) NOT NULL DEFAULT '0',
  `permcathex` varchar(11) NOT NULL DEFAULT '',
  `permcatname` varchar(55) NOT NULL DEFAULT '',
  `permcatparent` int(11) NOT NULL DEFAULT '0',
  `permcatchilren` int(11) NOT NULL DEFAULT '0',
  `permcatcount` int(11) NOT NULL DEFAULT '0',
  FOREIGN KEY (`instance_id`) REFERENCES `{PREFIX}instances` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_73C156013A51721D` (`instance_id`)
);

DROP TABLE IF EXISTS `{PREFIX}resellers`;
CREATE TABLE IF NOT EXISTS `{PREFIX}resellers` (
  `id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `uid` varchar(55) NOT NULL DEFAULT '',
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(510) NOT NULL DEFAULT '',
  `init_pw` varchar(510) NOT NULL DEFAULT '',
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `query_nickname` varchar(55) NOT NULL DEFAULT '',
  `lang` varchar(5) NOT NULL DEFAULT 'en_GB',
  `fixed_virtual_servers` longtext NOT NULL,
  `icon_pkg` varchar(510) NOT NULL DEFAULT 'images/pkg-default',
  `max_web_users` int(11) NOT NULL DEFAULT '10',
  `max_virtualservers` int(11) NOT NULL DEFAULT '10',
  `max_slots_per_virtualservers` int(11) NOT NULL DEFAULT '32',
  `allowed_own_instances` int(1) NOT NULL DEFAULT '0',
  `additional_accesses` longtext NOT NULL,
  `reg_date` datetime DEFAULT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `mfa_active` boolean NOT NULL DEFAULT '0',
  `mfa_type` varchar(55) NOT NULL DEFAULT 'none',
  `mfa_secret` varchar(210) NOT NULL DEFAULT '',
  FOREIGN KEY (`group_id`) REFERENCES `{PREFIX}user_groups` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_3E370E3FE54D947X` (`group_id`)
);

DROP TABLE IF EXISTS `{PREFIX}simple_bots`;
CREATE TABLE IF NOT EXISTS `{PREFIX}simple_bots` (
  `id` int(11) NOT NULL,
  `instance_id` int(11) DEFAULT NULL,
  `virtualserver_id` int(11) DEFAULT NULL,
  `bot_is_running` int(1) NOT NULL DEFAULT '0',
  `bot_is_stopped` int(1) NOT NULL DEFAULT '0',
  `bot_start_message` int(11) NOT NULL DEFAULT '1',
  `bot_uid_last` varchar(55) NOT NULL DEFAULT '',
  `bot_default_nickname` varchar(55) NOT NULL DEFAULT '',
  `bot_default_cid` int(11) NOT NULL DEFAULT '0',
  `bot_slow_mode` int(11) NOT NULL DEFAULT '0',
  `config` longtext DEFAULT NULL,
  `cron_autostart` int(11) NOT NULL DEFAULT '0',
  `bot_lang` varchar(11) NOT NULL DEFAULT 'en_GB',
  `bot_timezone` varchar(225) NOT NULL DEFAULT 'Europe/Berlin',
  `bot_modified` datetime DEFAULT NULL,
  `bot_created` datetime DEFAULT NULL,
  FOREIGN KEY (`instance_id`) REFERENCES `{PREFIX}instances` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_E48039FD3A51721D` (`instance_id`)
);

DROP TABLE IF EXISTS `{PREFIX}stats`;
CREATE TABLE IF NOT EXISTS `{PREFIX}stats` (
  `id` int(11) NOT NULL,
  `sub_id` int(11) NOT NULL DEFAULT '0',
  `sub_sid` int(11) NOT NULL DEFAULT '0',
  `type` varchar(55) NOT NULL DEFAULT '',
  `data` longtext NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `{PREFIX}users`;
CREATE TABLE IF NOT EXISTS `{PREFIX}users` (
  `id` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(510) NOT NULL DEFAULT '',
  `init_pw` varchar(510) NOT NULL DEFAULT '',
  `first_name` varchar(255) NOT NULL DEFAULT '',
  `last_name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `query_nickname` varchar(55) NOT NULL DEFAULT '',
  `lang` varchar(5) NOT NULL DEFAULT 'en_GB',
  `fixed_virtual_servers` varchar(510) NOT NULL DEFAULT '[[]]',
  `reg_date` datetime DEFAULT NULL,
  `active` int(1) NOT NULL DEFAULT '1',
  `icon_pkg` varchar(510) NOT NULL DEFAULT 'images/pkg-default',
  `reseller_id` int(11) DEFAULT NULL,
  `max_slots_per_virtualservers` int(11) NOT NULL DEFAULT '16',
  `mfa_active` boolean NOT NULL DEFAULT '0',
  `mfa_type` varchar(55) NOT NULL DEFAULT 'none',
  `mfa_secret` varchar(210) NOT NULL DEFAULT '',
  FOREIGN KEY (`reseller_id`) REFERENCES `{PREFIX}resellers` (`id`),
  FOREIGN KEY (`group_id`) REFERENCES `{PREFIX}user_groups` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_9DB84490FE54D947` (`group_id`),
  -- KEY `IDX_3C439D5691E6A19D` (`reseller_id`)
);

INSERT INTO `{PREFIX}users` (`id`, `group_id`, `username`, `password`, `init_pw`, `first_name`, `last_name`, `email`, `query_nickname`, `lang`, `fixed_virtual_servers`, `reg_date`, `active`, `icon_pkg`, `reseller_id`, `max_slots_per_virtualservers`) VALUES
  (1, 1, '{USERNAME}', '{PASSWORD}', '', '{FIRST_NAME}', '{LAST_NAME}', '{EMAIL}', '', '{LANG}', '[[]]', CURRENT_TIMESTAMP, 1, 'images/pkg-default', NULL, 16);

DROP TABLE IF EXISTS `{PREFIX}user_groups`;
CREATE TABLE IF NOT EXISTS `{PREFIX}user_groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `level` int(11) NOT NULL DEFAULT '0',
  `icon` varchar(255) NOT NULL DEFAULT '',
  `virtualserver_permissions` longtext,
  `virtualserver_modify` longtext,
  `virtualserver_channel_modify` longtext,
  `tsi_permissions` longtext,
  `reseller_id` int(11) DEFAULT NULL,
  FOREIGN KEY (`reseller_id`) REFERENCES `{PREFIX}resellers` (`id`),
  PRIMARY KEY (`id`)
  -- KEY `IDX_AFE189F491E6A19D` (`reseller_id`)
);

INSERT INTO `{PREFIX}user_groups` (`id`, `name`, `level`, `icon`, `virtualserver_permissions`, `virtualserver_modify`, `virtualserver_channel_modify`, `tsi_permissions`, `reseller_id`) VALUES
  (1, 'Super Administrator', 100, 'images/roles/c8ffe9a587b126f152ed3d89a146b445.png', '[[]]', '[[]]', '[[]]', '[[]]', NULL),
  (2, 'Co. Administrator', 75, 'images/roles/3def184ad8f4755ff269862ea77393dd.png', '{\"b_virtualserver_select\":\"1\",\"b_virtualserver_info_view\":\"1\",\"b_virtualserver_connectioninfo_view\":\"1\",\"b_virtualserver_channel_list\":\"1\",\"b_virtualserver_channel_search\":\"1\",\"b_virtualserver_client_list\":\"1\",\"b_virtualserver_client_search\":\"1\",\"b_virtualserver_client_dblist\":\"1\",\"b_virtualserver_client_dbsearch\":\"1\",\"b_virtualserver_client_dbinfo\":\"1\",\"b_virtualserver_permission_find\":\"1\",\"b_virtualserver_custom_search\":\"1\",\"b_virtualserver_start\":\"1\",\"b_virtualserver_stop\":\"1\",\"b_virtualserver_token_list\":\"1\",\"b_virtualserver_token_add\":\"1\",\"b_virtualserver_token_use\":\"1\",\"b_virtualserver_token_delete\":\"1\",\"b_virtualserver_log_view\":\"1\",\"b_virtualserver_log_add\":\"1\",\"b_virtualserver_join_ignore_password\":\"1\",\"b_virtualserver_notify_register\":\"1\",\"b_virtualserver_notify_unregister\":\"1\",\"b_virtualserver_snapshot_create\":\"1\",\"b_virtualserver_snapshot_deploy\":\"1\",\"b_virtualserver_permission_reset\":\"1\",\"b_virtualserver_modify_name\":\"1\",\"b_virtualserver_modify_welcomemessage\":\"1\",\"b_virtualserver_modify_reserved_slots\":\"1\",\"b_virtualserver_modify_password\":\"1\",\"b_virtualserver_modify_default_servergroup\":\"1\",\"b_virtualserver_modify_default_channelgroup\":\"1\",\"b_virtualserver_modify_default_channeladmingroup\":\"1\",\"b_virtualserver_modify_channel_forced_silence\":\"1\",\"b_virtualserver_modify_complain\":\"1\",\"b_virtualserver_modify_antiflood\":\"1\",\"b_virtualserver_modify_ft_settings\":\"1\",\"b_virtualserver_modify_ft_quotas\":\"1\",\"b_virtualserver_modify_hostmessage\":\"1\",\"b_virtualserver_modify_hostbanner\":\"1\",\"b_virtualserver_modify_hostbutton\":\"1\",\"b_virtualserver_modify_port\":\"1\",\"b_virtualserver_modify_autostart\":\"1\",\"b_virtualserver_modify_needed_identity_security_level\":\"1\",\"b_virtualserver_modify_priority_speaker_dimm_modificator\":\"1\",\"b_virtualserver_modify_log_settings\":\"1\",\"b_virtualserver_modify_min_client_version\":\"1\",\"b_virtualserver_modify_icon_id\":\"1\",\"b_virtualserver_modify_weblist\":\"1\",\"b_virtualserver_modify_codec_encryption_mode\":\"1\",\"b_virtualserver_modify_temporary_passwords\":\"1\",\"b_virtualserver_modify_channel_temp_delete_delay_default\":\"1\",\"i_channel_min_depth\":\"1\",\"i_channel_max_depth\":\"1\",\"b_channel_group_inheritance_end\":\"1\",\"i_channel_permission_modify_power\":\"1\",\"i_channel_needed_permission_modify_power\":\"1\",\"b_channel_info_view\":\"1\",\"b_channel_create_child\":\"1\",\"b_channel_create_permanent\":\"1\",\"b_channel_create_semi_permanent\":\"1\",\"b_channel_create_temporary\":\"1\",\"b_channel_create_private\":\"1\",\"b_channel_create_with_topic\":\"1\",\"b_channel_create_with_description\":\"1\",\"b_channel_create_with_password\":\"1\",\"b_channel_create_modify_with_codec_speex8\":\"1\",\"b_channel_create_modify_with_codec_speex16\":\"1\",\"b_channel_create_modify_with_codec_speex32\":\"1\",\"b_channel_create_modify_with_codec_celtmono48\":\"1\",\"b_channel_create_modify_with_codec_opusvoice\":\"1\",\"b_channel_create_modify_with_codec_opusmusic\":\"1\",\"i_channel_create_modify_with_codec_maxquality\":\"1\",\"i_channel_create_modify_with_codec_latency_factor_min\":\"1\",\"b_channel_create_with_maxclients\":\"1\",\"b_channel_create_with_maxfamilyclients\":\"1\",\"b_channel_create_with_sortorder\":\"1\",\"b_channel_create_with_default\":\"1\",\"b_channel_create_with_needed_talk_power\":\"1\",\"b_channel_create_modify_with_force_password\":\"1\",\"i_channel_create_modify_with_temp_delete_delay\":\"1\",\"b_channel_modify_parent\":\"1\",\"b_channel_modify_make_default\":\"1\",\"b_channel_modify_make_permanent\":\"1\",\"b_channel_modify_make_semi_permanent\":\"1\",\"b_channel_modify_make_temporary\":\"1\",\"b_channel_modify_name\":\"1\",\"b_channel_modify_topic\":\"1\",\"b_channel_modify_description\":\"1\",\"b_channel_modify_password\":\"1\",\"b_channel_modify_codec\":\"1\",\"b_channel_modify_codec_quality\":\"1\",\"b_channel_modify_codec_latency_factor\":\"1\",\"b_channel_modify_maxclients\":\"1\",\"b_channel_modify_maxfamilyclients\":\"1\",\"b_channel_modify_sortorder\":\"1\",\"b_channel_modify_needed_talk_power\":\"1\",\"i_channel_modify_power\":\"1\",\"i_channel_needed_modify_power\":\"1\",\"b_channel_modify_make_codec_encrypted\":\"1\",\"b_channel_modify_temp_delete_delay\":\"1\",\"b_channel_delete_permanent\":\"1\",\"b_channel_delete_semi_permanent\":\"1\",\"b_channel_delete_temporary\":\"1\",\"b_channel_delete_flag_force\":\"1\",\"i_channel_delete_power\":\"1\",\"i_channel_needed_delete_power\":\"1\",\"b_channel_join_permanent\":\"1\",\"b_channel_join_semi_permanent\":\"1\",\"b_channel_join_temporary\":\"1\",\"b_channel_join_ignore_password\":\"1\",\"b_channel_join_ignore_maxclients\":\"1\",\"i_channel_join_power\":\"1\",\"i_channel_needed_join_power\":\"1\",\"i_channel_subscribe_power\":\"1\",\"i_channel_needed_subscribe_power\":\"1\",\"i_channel_description_view_power\":\"1\",\"i_channel_needed_description_view_power\":\"1\",\"i_icon_id\":\"1\",\"i_max_icon_filesize\":\"1\",\"b_icon_manage\":\"1\",\"b_group_is_permanent\":\"1\",\"i_group_auto_update_type\":\"1\",\"i_group_auto_update_max_value\":\"1\",\"i_group_sort_id\":\"1\",\"i_group_show_name_in_tree\":\"1\",\"b_virtualserver_servergroup_list\":\"1\",\"b_virtualserver_servergroup_permission_list\":\"1\",\"b_virtualserver_servergroup_client_list\":\"1\",\"b_virtualserver_channelgroup_list\":\"1\",\"b_virtualserver_channelgroup_permission_list\":\"1\",\"b_virtualserver_channelgroup_client_list\":\"1\",\"b_virtualserver_client_permission_list\":\"1\",\"b_virtualserver_channel_permission_list\":\"1\",\"b_virtualserver_channelclient_permission_list\":\"1\",\"b_virtualserver_servergroup_create\":\"1\",\"b_virtualserver_channelgroup_create\":\"1\",\"i_group_modify_power\":\"1\",\"i_group_needed_modify_power\":\"1\",\"i_group_member_add_power\":\"1\",\"i_group_needed_member_add_power\":\"1\",\"i_group_member_remove_power\":\"1\",\"i_group_needed_member_remove_power\":\"1\",\"i_permission_modify_power\":\"1\",\"b_permission_modify_power_ignore\":\"1\",\"b_virtualserver_servergroup_delete\":\"1\",\"b_virtualserver_channelgroup_delete\":\"1\",\"i_client_permission_modify_power\":\"1\",\"i_client_needed_permission_modify_power\":\"1\",\"i_client_max_clones_uid\":\"1\",\"i_client_max_idletime\":\"1\",\"i_client_max_avatar_filesize\":\"1\",\"i_client_max_channel_subscriptions\":\"1\",\"b_client_is_priority_speaker\":\"1\",\"b_client_skip_channelgroup_permissions\":\"1\",\"b_client_force_push_to_talk\":\"1\",\"b_client_ignore_bans\":\"1\",\"b_client_ignore_antiflood\":\"1\",\"b_client_issue_client_query_command\":\"1\",\"b_client_use_reserved_slot\":\"1\",\"b_client_use_channel_commander\":\"1\",\"b_client_request_talker\":\"1\",\"b_client_avatar_delete_other\":\"1\",\"b_client_is_sticky\":\"1\",\"b_client_ignore_sticky\":\"1\",\"b_client_info_view\":\"1\",\"b_client_permissionoverview_view\":\"1\",\"b_client_permissionoverview_own\":\"1\",\"b_client_remoteaddress_view\":\"1\",\"i_client_serverquery_view_power\":\"1\",\"i_client_needed_serverquery_view_power\":\"1\",\"b_client_custom_info_view\":\"1\",\"i_client_kick_from_server_power\":\"1\",\"i_client_needed_kick_from_server_power\":\"1\",\"i_client_kick_from_channel_power\":\"1\",\"i_client_needed_kick_from_channel_power\":\"1\",\"i_client_ban_power\":\"1\",\"i_client_needed_ban_power\":\"1\",\"i_client_move_power\":\"1\",\"i_client_needed_move_power\":\"1\",\"i_client_complain_power\":\"1\",\"i_client_needed_complain_power\":\"1\",\"b_client_complain_list\":\"1\",\"b_client_complain_delete_own\":\"1\",\"b_client_complain_delete\":\"1\",\"b_client_ban_list\":\"1\",\"b_client_ban_create\":\"1\",\"b_client_ban_delete_own\":\"1\",\"b_client_ban_delete\":\"1\",\"i_client_ban_max_bantime\":\"1\",\"i_client_private_textmessage_power\":\"1\",\"i_client_needed_private_textmessage_power\":\"1\",\"b_client_server_textmessage_send\":\"1\",\"b_client_channel_textmessage_send\":\"1\",\"b_client_offline_textmessage_send\":\"1\",\"i_client_talk_power\":\"1\",\"i_client_needed_talk_power\":\"1\",\"i_client_poke_power\":\"1\",\"i_client_needed_poke_power\":\"1\",\"b_client_set_flag_talker\":\"1\",\"i_client_whisper_power\":\"1\",\"i_client_needed_whisper_power\":\"1\",\"b_client_modify_description\":\"1\",\"b_client_modify_own_description\":\"1\",\"b_client_modify_dbproperties\":\"1\",\"b_client_delete_dbproperties\":\"1\",\"b_client_create_modify_serverquery_login\":\"1\",\"b_ft_ignore_password\":\"1\",\"b_ft_transfer_list\":\"1\",\"i_ft_file_upload_power\":\"1\",\"i_ft_needed_file_upload_power\":\"1\",\"i_ft_file_download_power\":\"1\",\"i_ft_needed_file_download_power\":\"1\",\"i_ft_file_delete_power\":\"1\",\"i_ft_needed_file_delete_power\":\"1\",\"i_ft_file_rename_power\":\"1\",\"i_ft_needed_file_rename_power\":\"1\",\"i_ft_file_browse_power\":\"1\",\"i_ft_needed_file_browse_power\":\"1\",\"i_ft_directory_create_power\":\"1\",\"i_ft_needed_directory_create_power\":\"1\",\"i_ft_quota_mb_download_per_client\":\"1\",\"i_ft_quota_mb_upload_per_client\":\"1\"}', '{\"virtualserver_name\":\"1\",\"virtualserver_icon_id\":\"1\",\"virtualserver_welcomemessage\":\"1\",\"virtualserver_password\":\"1\",\"virtualserver_reserved_slots\":\"1\",\"virtualserver_weblist_enabled\":\"1\",\"virtualserver_hostmessage\":\"1\",\"virtualserver_hostbanner_url\":\"1\",\"virtualserver_hostbanner_gfx_url\":\"1\",\"virtualserver_hostbanner_gfx_intervall\":\"1\",\"virtualserver_hostbutton_tooltip\":\"1\",\"virtualserver_hostbutton_gfx_url\":\"1\",\"virtualserver_hostbutton_url\":\"1\",\"virtualserver_max_download_total_bandwith\":\"1\",\"virtualserver_download_quota\":\"1\",\"virtualserver_max_upload_total_bandwith\":\"1\",\"virtualserver_upload_quota\":\"1\",\"virtualserver_anti_flood_options\":\"1\",\"virtualserver_security_options\":\"1\",\"virtualserver_standard_groups_options\":\"1\",\"virtualserver_compainment_options\":\"1\",\"virtualserver_other_options\":\"1\",\"virtualserver_protocol_options\":\"1\"}', '{\"channel_name\":\"1\",\"channel_icon_id\":\"1\",\"channel_password\":\"1\",\"channel_topic\":\"1\",\"channel_description\":\"1\",\"channel_type_options\":\"1\",\"channel_moderation_options\":\"1\",\"channel_audio_options\":\"1\",\"channel_normal_needed_power_options\":\"1\",\"channel_filetransfer_needed_power_options\":\"1\",\"channel_other_options\":\"1\",\"channel_max_clients_options\":\"1\",\"channel_max_client_tree_options\":\"1\"}', '{\"tsi_instance_import_icon_data\":\"1\",\"tsi_instance_import_permission_data\":\"1\",\"tsi_virtualserver_import_icon_data\":\"1\",\"tsi_virtualserver_log_list\":\"1\",\"tsi_virtualserver_log_create\":\"1\",\"tsi_virtualserver_complaints_list\":\"1\",\"tsi_virtualserver_complaints_delete\":\"1\",\"tsi_virtualserver_token_list\":\"1\",\"tsi_virtualserver_token_delete\":\"1\",\"tsi_virtualserver_token_create\":\"1\",\"tsi_virtualserver_ban_list\":\"1\",\"tsi_virtualserver_ban_delete\":\"1\",\"tsi_virtualserver_snapshot_list\":\"1\",\"tsi_virtualserver_snapshot_create\":\"1\",\"tsi_virtualserver_snapshot_delete\":\"1\",\"tsi_virtualserver_snapshot_download\":\"1\",\"tsi_virtualserver_servergroup_delete\":\"1\",\"tsi_virtualserver_servergroup_client_list\":\"1\",\"tsi_virtualserver_servergroup_create\":\"1\",\"tsi_virtualserver_servergroup_permission_list\":\"1\",\"tsi_virtualserver_channelgroup_delete\":\"1\",\"tsi_virtualserver_channelgroup_client_list\":\"1\",\"tsi_virtualserver_channelgroup_create\":\"1\",\"tsi_virtualserver_channelgroup_permission_list\":\"1\",\"tsi_virtualserver_client_delete\":\"1\",\"tsi_virtualserver_client_permission_list\":\"1\",\"tsi_virtualserver_client_add_servergroups\":\"1\",\"tsi_virtualserver_client_remove_servergroups\":\"1\",\"tsi_virtualserver_client_modify_channelgroup\":\"1\",\"tsi_virtualserver_channel_delete\":\"1\",\"tsi_virtualserver_channel_create\":\"1\",\"tsi_virtualserver_files_download\":\"1\",\"tsi_virtualserver_files_upload\":\"1\",\"tsi_virtualserver_files_delete\":\"1\"}', NULL),
  (3, 'Moderator', 50, 'images/roles/da4fb5c6e93e74d3df8527599fa62642.png', '[[]]', '{\"virtualserver_security_options\":\"1\",\"virtualserver_compainment_options\":\"1\"}', '{\"channel_moderation_options\":\"1\",\"channel_normal_needed_power_options\":\"1\",\"channel_filetransfer_needed_power_options\":\"1\",\"channel_other_options\":\"1\",\"channel_max_clients_options\":\"1\",\"channel_max_client_tree_options\":\"1\"}', '{\"tsi_instance_import_icon_data\":\"1\",\"tsi_instance_import_permission_data\":\"1\",\"tsi_virtualserver_import_icon_data\":\"1\",\"tsi_virtualserver_log_list\":\"1\",\"tsi_virtualserver_log_create\":\"1\",\"tsi_virtualserver_complaints_list\":\"1\",\"tsi_virtualserver_complaints_delete\":\"1\",\"tsi_virtualserver_token_list\":\"1\",\"tsi_virtualserver_token_delete\":\"1\",\"tsi_virtualserver_ban_list\":\"1\",\"tsi_virtualserver_ban_delete\":\"1\",\"tsi_virtualserver_servergroup_client_list\":\"1\",\"tsi_virtualserver_channelgroup_client_list\":\"1\",\"tsi_virtualserver_client_delete\":\"1\",\"tsi_virtualserver_client_add_servergroups\":\"1\",\"tsi_virtualserver_client_remove_servergroups\":\"1\",\"tsi_virtualserver_client_modify_channelgroup\":\"1\",\"tsi_virtualserver_files_download\":\"1\",\"tsi_virtualserver_files_upload\":\"1\",\"tsi_virtualserver_files_delete\":\"1\"}', NULL),
  (4, 'Viewer', 0, 'images/roles/069059b7ef840f0c74a814ec9237b6ec.png', '[[]]', '[[]]', '[[]]', '[[]]', NULL);

PRAGMA foreign_keys = ON;