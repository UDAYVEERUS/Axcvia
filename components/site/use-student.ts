"use client";

import { useEffect, useState } from "react";

export interface StudentState {
  loaded: boolean;
  student: { name: string } | null;
  enrolled: boolean;
  wishlisted: boolean;
}

export function useStudent(course?: string): StudentState {
  const [state, setState] = useState<StudentState>({ loaded: false, student: null, enrolled: false, wishlisted: false });
  useEffect(() => {
    let alive = true;
    fetch(`/api/student/me${course ? `?course=${encodeURIComponent(course)}` : ""}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => alive && setState({ loaded: true, ...j }))
      .catch(() => alive && setState((s) => ({ ...s, loaded: true })));
    return () => {
      alive = false;
    };
  }, [course]);
  return state;
}
