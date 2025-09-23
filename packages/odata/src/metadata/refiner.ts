import type { RawMetadataProperty } from './metadata'

type Subscriber = () => void
type SubscriptionKey = string // Used to represent the model/entitySet pair key

/**
 * The MetadataRefiner class is a singleton that provides methods to refine metadata properties.
 */
class MetadataRefiner {
  private refineMap = new Map<string, Partial<Omit<RawMetadataProperty, '$Name'>>>()
  private subscribers: Map<SubscriptionKey, Subscriber[]> = new Map()
  private debounceTimeouts: Map<SubscriptionKey, NodeJS.Timeout | null> = new Map()

  private constructor() {}

  public static getInstance(): MetadataRefiner {
    if (!MetadataRefiner.instance) {
      MetadataRefiner.instance = new MetadataRefiner()
    }
    return MetadataRefiner.instance
  }

  private static instance: MetadataRefiner | null = null

  // Utility to generate the key for refineMap and subscriptions
  private generateKey(model: string, entitySet: string, field?: string): string {
    return field ? [model, entitySet, field].join('/') : [model, entitySet].join('/')
  }

  public refineField<T extends string = string>(
    model: string,
    entitySet: string,
    field: T,
    definition: Partial<Omit<RawMetadataProperty, '$Name'>>
  ) {
    const fieldKey = this.generateKey(model, entitySet, field)
    this.refineMap.set(fieldKey, { ...(this.refineMap.get(fieldKey) || {}), ...definition })

    const subscriptionKey = this.generateKey(model, entitySet)

    // Notify relevant subscribers in a debounced manner
    if (this.debounceTimeouts.get(subscriptionKey) !== null) {
      clearTimeout(this.debounceTimeouts.get(subscriptionKey)!)
    }

    this.debounceTimeouts.set(
      subscriptionKey,
      setTimeout(() => {
        const modelEntitySubscribers = this.subscribers.get(subscriptionKey)
        if (modelEntitySubscribers) {
          for (const subscriber of modelEntitySubscribers) {
            subscriber()
          }
        }
        this.debounceTimeouts.set(subscriptionKey, null) // Reset the timeout after execution
      }, 1)
    )
  }

  public refinedField(model: string, entitySet: string, field: string) {
    const key = this.generateKey(model, entitySet, field)
    return this.refineMap.get(key)
  }

  public subscribe(model: string, entitySet: string, subscriber: Subscriber) {
    const subscriptionKey = this.generateKey(model, entitySet)
    if (!this.subscribers.has(subscriptionKey)) {
      this.subscribers.set(subscriptionKey, [])
    }
    this.subscribers.get(subscriptionKey)!.push(subscriber)
  }

  public unsubscribe(model: string, entitySet: string, subscriber: Subscriber) {
    const subscriptionKey = this.generateKey(model, entitySet)
    const modelEntitySubscribers = this.subscribers.get(subscriptionKey)
    if (modelEntitySubscribers) {
      const index = modelEntitySubscribers.indexOf(subscriber)
      if (index !== -1) {
        modelEntitySubscribers.splice(index, 1)
      }
    }
  }
}

/**
 * Retrieves the singleton instance of the MetadataRefiner.
 *
 * The MetadataRefiner class is a singleton that provides methods to refine metadata properties
 *
 * @returns {MetadataRefiner} The singleton instance of the MetadataRefiner.
 */
export function getMetadataRefiner(): MetadataRefiner {
  return MetadataRefiner.getInstance()
}
