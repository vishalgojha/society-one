import { supabase } from '@/api/supabaseClient';

const STORAGE_KEYS = {
  role: 'activeRole',
  societyId: 'activeSocietyId',
};

const tableConfigs = {
  VisitorEntry: {
    table: 'visitor_entries',
    orderFallback: { column: 'check_in_time', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      propertyId: 'property_id',
      operatorId: 'operator_id',
      name: 'name',
      phone: 'phone',
      purpose: 'purpose',
      visitorType: 'visitor_type',
      facePhoto: 'face_photo_url',
      idPhoto: 'id_photo_url',
      checkInTime: 'check_in_time',
      checkOutTime: 'check_out_time',
      isVIP: 'is_vip',
      verified: 'verified',
      createdAt: 'created_at',
      status: 'status',
      spokenText: 'spoken_text',
      flatOrRoom: 'flat_or_room',
      securityVerification: 'security_verification',
      parsedName: 'name',
      parsedMobile: 'phone',
      parsedPurpose: 'purpose',
    },
    jsonFields: ['security_verification'],
  },
  Operator: {
    table: 'operators',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      userId: 'user_id',
      societyId: 'society_id',
      propertyId: 'property_id',
      name: 'name',
      phone: 'phone',
      role: 'role',
      isOnDuty: 'is_on_duty',
      isActive: 'is_active',
      createdAt: 'created_at',
      updatedDate: 'updated_at',
    },
  },
  Property: {
    table: 'properties',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      unitNumber: 'unit_number',
      block: 'block',
      ownerName: 'owner_name',
      createdAt: 'created_at',
      name: 'name',
      type: 'type',
    },
  },
  PreApprovedVisitor: {
    table: 'pre_approved_visitors',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      propertyId: 'property_id',
      name: 'name',
      phone: 'phone',
      validFrom: 'valid_from',
      validUntil: 'valid_until',
      createdAt: 'created_at',
      residentUserId: 'resident_user_id',
    },
  },
  NotificationSettings: {
    table: 'notification_settings',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      operatorId: 'operator_id',
      propertyId: 'property_id',
      whatsappEnabled: 'whatsapp_enabled',
      emailEnabled: 'email_enabled',
      createdAt: 'created_at',
    },
  },
  NotificationLog: {
    table: 'notification_logs',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      operatorId: 'operator_id',
      visitorEntryId: 'visitor_entry_id',
      title: 'title',
      body: 'body',
      channel: 'channel',
      createdAt: 'created_at',
    },
  },
  RecurringVisitor: {
    table: 'recurring_visitors',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      propertyId: 'property_id',
      name: 'name',
      phone: 'phone',
      visitorType: 'visitor_type',
      lastSeenAt: 'last_seen_at',
      createdAt: 'created_at',
    },
  },
  Society: {
    table: 'societies',
    orderFallback: { column: 'created_at', ascending: false },
    societyScoped: false,
    fields: {
      id: 'id',
      name: 'name',
      address: 'address',
      createdAt: 'created_at',
    },
  },
  ScheduledTask: {
    table: 'scheduled_tasks',
    orderFallback: { column: 'created_at', ascending: false },
    fields: {
      id: 'id',
      societyId: 'society_id',
      name: 'name',
      cron: 'cron',
      functionName: 'function_name',
      functionArgs: 'function_args',
      createdAt: 'created_at',
    },
    jsonFields: ['function_args'],
  },
};

const invertFields = (fields) =>
  Object.entries(fields).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const getRole = () => localStorage.getItem(STORAGE_KEYS.role);
export const getCurrentSocietyId = () => localStorage.getItem(STORAGE_KEYS.societyId);
const isSuperAdmin = () => getRole() === 'super_admin';

const toSnake = (entityName, input = {}) => {
  const config = tableConfigs[entityName];
  const output = {};

  Object.entries(input).forEach(([key, value]) => {
    const mappedKey = config.fields[key] ?? key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    output[mappedKey] = value;
  });

  if (config.jsonFields) {
    config.jsonFields.forEach((field) => {
      if (output[field] !== undefined && output[field] !== null && typeof output[field] !== 'string') {
        output[field] = output[field];
      }
    });
  }

  return output;
};

const toCamel = (entityName, row) => {
  if (!row) return row;
  const config = tableConfigs[entityName];
  const reverseMap = invertFields(config.fields);
  const output = {};

  Object.entries(row).forEach(([key, value]) => {
    const camelKey = reverseMap[key] ?? key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    output[camelKey] = value;
  });

  if (entityName === 'VisitorEntry') {
    output.parsedName = output.name ?? output.parsedName ?? '';
    output.parsedMobile = output.phone ?? output.parsedMobile ?? '';
    output.parsedPurpose = output.purpose ?? output.parsedPurpose ?? '';
    output.facePhoto = output.facePhoto ?? output.facePhotoUrl;
    output.idPhoto = output.idPhoto ?? output.idPhotoUrl;
  }

  return output;
};

const applySocietyScope = (query, entityName) => {
  const config = tableConfigs[entityName];
  if (config.societyScoped === false || isSuperAdmin()) {
    return query;
  }

  const societyId = getCurrentSocietyId();
  return societyId ? query.eq('society_id', societyId) : query;
};

const applyFilters = (query, entityName, filters = {}) => {
  const config = tableConfigs[entityName];

  return Object.entries(filters).reduce((currentQuery, [rawKey, value]) => {
    if (value === undefined || value === null || value === '') {
      return currentQuery;
    }

    const key = config.fields[rawKey] ?? rawKey.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

    if (Array.isArray(value)) {
      return currentQuery.in(key, value);
    }

    if (typeof value === 'object' && value !== null) {
      if (value.gte !== undefined) return currentQuery.gte(key, value.gte);
      if (value.lte !== undefined) return currentQuery.lte(key, value.lte);
      if (value.ilike !== undefined) return currentQuery.ilike(key, value.ilike);
    }

    return currentQuery.eq(key, value);
  }, query);
};

const applyOrder = (query, entityName, orderBy) => {
  const config = tableConfigs[entityName];
  const fallback = config.orderFallback;

  if (!orderBy) {
    return fallback ? query.order(fallback.column, { ascending: fallback.ascending }) : query;
  }

  const descending = String(orderBy).startsWith('-');
  const rawKey = descending ? String(orderBy).slice(1) : String(orderBy);
  const column = config.fields[rawKey] ?? rawKey.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  return query.order(column, { ascending: !descending });
};

const makeEntity = (entityName) => ({
  async filter(conditions = {}, orderBy, limit) {
    let query = supabase.from(tableConfigs[entityName].table).select('*');
    query = applySocietyScope(query, entityName);
    query = applyFilters(query, entityName, conditions);
    query = applyOrder(query, entityName, orderBy);
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => toCamel(entityName, row));
  },
  async list(orderBy, limit) {
    return this.filter({}, orderBy, limit);
  },
  async get(id) {
    let query = supabase.from(tableConfigs[entityName].table).select('*').eq('id', id).maybeSingle();
    query = applySocietyScope(query, entityName);
    const { data, error } = await query;
    if (error) throw error;
    return toCamel(entityName, data);
  },
  async create(payload) {
    const record = toSnake(entityName, payload);
    if (tableConfigs[entityName].societyScoped !== false && !record.society_id && !isSuperAdmin()) {
      record.society_id = getCurrentSocietyId();
    }
    const { data, error } = await supabase.from(tableConfigs[entityName].table).insert(record).select('*').single();
    if (error) throw error;
    return toCamel(entityName, data);
  },
  async update(id, payload) {
    let query = supabase.from(tableConfigs[entityName].table).update(toSnake(entityName, payload)).eq('id', id).select('*').single();
    query = applySocietyScope(query, entityName);
    const { data, error } = await query;
    if (error) throw error;
    return toCamel(entityName, data);
  },
  async delete(id) {
    let query = supabase.from(tableConfigs[entityName].table).delete().eq('id', id);
    query = applySocietyScope(query, entityName);
    const { error } = await query;
    if (error) throw error;
    return true;
  },
  subscribe(callback) {
    const table = tableConfigs[entityName].table;
    const societyId = getCurrentSocietyId();
    const channel = supabase
      .channel(`${table}-${societyId ?? 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(societyId ? { filter: `society_id=eq.${societyId}` } : {}),
        },
        (payload) => callback({
          eventType: payload.eventType,
          new: toCamel(entityName, payload.new),
          old: toCamel(entityName, payload.old),
        })
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
});

export const entities = Object.keys(tableConfigs).reduce((acc, entityName) => {
  acc[entityName] = makeEntity(entityName);
  return acc;
}, {});
