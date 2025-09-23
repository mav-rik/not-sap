import { ifetch, IFetchError } from '@notsap/odata';

export interface TVariant {
  changeType: string;
  reference: string;
  namespace: string;
  projectId: string;
  originalLanguage: string;
  layer: 'USER' | 'PUBLIC';
  fileType: 'variant';
  fileName: string;
  content: Record<string, unknown>;
  texts: { variantName: { value: string; type: 'XFLD' } };
  favorite: boolean;
  executeOnSelection: boolean;
  standardVariant: boolean;
  selector: { persistencyKey: string };
  support: {
    user: string;
  };
  variantId: string;
}

const _variants = new Map<string, Promise<Map<string, TVariant>>>();

export class PresetManager {
  constructor(public readonly appName: string) {}

  protected _csrfToken: {
    value: string;
    expires: number;
    promise?: Promise<string>;
  } = {
    value: '',
    expires: 0,
  };

  get namespace() {
    return `apps/${this.appName}/changes/`;
  }

  async getCSRF() {
    const time = Date.now();
    if (this._csrfToken.expires < time) {
      if (this._csrfToken.promise) return this._csrfToken.promise;
      this._csrfToken.promise = new Promise((resolve, reject) => {
        fetch('/sap/bc/lrep/actions/getcsrftoken/', {
          method: 'HEAD',
          headers: {
            'X-CSRF-Token': 'fetch',
          },
        })
          .then((resp) => {
            const csrfToken = resp.headers.get('X-CSRF-Token') || '';
            if (!csrfToken) {
              reject(
                new IFetchError('Failed to retrieve CSRF token', resp.status, resp.statusText)
              );
            }
            resolve(csrfToken);
          })
          .catch(reject);
      });
      this._csrfToken.value = await this._csrfToken.promise;
      this._csrfToken.promise = undefined;
      this._csrfToken.expires = time + 60000 * 3;
    }

    return this._csrfToken.value;
  }

  async get(id: string) {
    return (await this.getAll())?.get(id);
  }

  async getAll() {
    if (!_variants.has(this.appName)) {
      const promise = this.read();
      const varMap = promise.then((v) => {
        const m = new Map<string, TVariant>();
        for (const c of v.body.changes || []) {
          m.set(c.fileName, c);
        }
        return m;
      });
      _variants.set(this.appName, varMap);
    }
    return await _variants.get(this.appName);
  }

  async read() {
    return ifetch<{ changes?: TVariant[] }>('/sap/bc/lrep/flex/data/' + this.appName);
  }

  async create(
    key = 'default',
    data: {
      id?: string;
      label: string;
      changeType: string;
      content: Record<string, unknown>;
      public?: boolean;
      fav?: boolean;
      executeOnSelection?: boolean;
      standard?: boolean;
    }
  ) {
    const variantId = data.id || `${key}_${Date.now()}_${data.changeType}`;
    _variants.delete(this.appName);
    const payload = {
      changeType: data.changeType,
      reference: this.appName,
      namespace: this.namespace,
      projectId: this.appName,
      originalLanguage: 'EN',
      layer: data.public ? 'PUBLIC' : 'USER',
      fileType: 'variant',
      fileName: variantId,
      content: data.content,
      texts: { variantName: { value: data.label, type: 'XFLD' } },
      favorite: !data.public && !!data.fav,
      executeOnSelection: !!data.executeOnSelection,
      standardVariant: !!data.standard,
      contexts: {},
      selector: { persistencyKey: [this.appName, key].join('.') },
      variantId,
    };
    await ifetch('/sap/bc/lrep/variants/' + this.appName, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await this.getCSRF(),
      },
      body: JSON.stringify([payload]),
    });
    if (data.public && !!data.fav) {
      // in case of public variant and favorite, we need to create USER layer variant as well
      payload.favorite = true;
      payload.layer = 'USER';
      await ifetch('/sap/bc/lrep/variants/' + this.appName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': await this.getCSRF(),
        },
        body: JSON.stringify([payload]),
      });
    }
    _variants.delete(this.appName);
    return variantId;
  }

  async update(
    id: string,
    data: {
      label?: string;
      content?: Record<string, unknown>;
      fav?: boolean;
      executeOnSelection?: boolean;
      standard?: boolean;
    }
  ) {
    const obj = await this.get(id);
    if (!obj) throw new Error('Variant not found');
    if (data.label) obj.texts = { variantName: { value: data.label, type: 'XFLD' } };
    if (data.content) obj.content = data.content;
    if (typeof data.fav === 'boolean') obj.favorite = data.fav;
    if (typeof data.executeOnSelection === 'boolean')
      obj.executeOnSelection = data.executeOnSelection;
    if (typeof data.standard === 'boolean') obj.standardVariant = data.standard;

    await ifetch('/sap/bc/lrep/variants/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await this.getCSRF(),
      },
      body: JSON.stringify(obj),
    });

    _variants.delete(this.appName);
  }

  async delete(id: string) {
    const obj = await this.get(id);
    if (!obj) throw new Error('Variant not found');
    await ifetch(`/sap/bc/lrep/variants/${id}?namespace=${this.namespace}&layer=${obj.layer}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': await this.getCSRF(),
      },
    });
    _variants.delete(this.appName);
  }
}
