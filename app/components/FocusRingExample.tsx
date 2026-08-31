/**
 * FocusRing Component Example
 *
 * This file demonstrates how to use the FocusRing component in your pages.
 * The FocusRing is the signature component of Personal OS design system.
 */

import FocusRing from '@/app/components/FocusRing';

export default function FocusRingExample() {
  return (
    <div style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      {/* Basic Usage */}
      <div>
        <h3>Basic Usage</h3>
        <FocusRing hours={3.5} goalHours={8} />
      </div>

      {/* Different Progress Levels */}
      <div>
        <h3>Low Progress (Rose)</h3>
        <FocusRing hours={2} goalHours={8} />
      </div>

      <div>
        <h3>Medium Progress (Rose)</h3>
        <FocusRing hours={5} goalHours={8} />
      </div>

      <div>
        <h3>High Progress (Indigo)</h3>
        <FocusRing hours={6.5} goalHours={8} />
      </div>

      <div>
        <h3>Complete (Emerald)</h3>
        <FocusRing hours={8} goalHours={8} />
      </div>

      {/* Different Sizes */}
      <div>
        <h3>Small (80px)</h3>
        <FocusRing hours={4} goalHours={8} size={80} strokeWidth={5} />
      </div>

      <div>
        <h3>Large (160px)</h3>
        <FocusRing hours={6} goalHours={8} size={160} strokeWidth={8} />
      </div>

      {/* Without Animation */}
      <div>
        <h3>No Animation</h3>
        <FocusRing hours={5} goalHours={8} animated={false} />
      </div>
    </div>
  );
}
