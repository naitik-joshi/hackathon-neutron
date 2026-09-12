"""
Live Directory Watcher using watchdog.
Monitors ./watch_papers for new or updated .docx, .txt, and .pdf files,
parsing them dynamically into the in-memory runtime store without restarting.
"""

from pathlib import Path
import time
from typing import Callable, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileSystemEvent

from config import WATCH_DIR
from parser import DocumentParser
from store import DocumentStore


class PaperFileHandler(FileSystemEventHandler):
    """
    Event handler responding to filesystem changes in the watch directory.
    """

    SUPPORTED_EXTENSIONS = {".docx", ".txt", ".md", ".pdf"}

    def __init__(self, store: DocumentStore, on_change_callback: Optional[Callable[[str, str], None]] = None) -> None:
        super().__init__()
        self.store = store
        self.callback = on_change_callback

    def _is_valid_file(self, path: Path) -> bool:
        # Ignore temporary files created by editors/Word (e.g., ~$paper.docx)
        if path.name.startswith("~$") or path.name.startswith("."):
            return False
        return path.suffix.lower() in self.SUPPORTED_EXTENSIONS

    def _safe_parse_and_index(self, path: Path) -> bool:
        """Attempt to parse the file with retry logic to avoid file lock collisions."""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                if not path.exists():
                    return False
                sections = DocumentParser.parse_file(path)
                self.store.add_or_update(path.name, sections)
                if self.callback:
                    self.callback("indexed", path.name)
                return True
            except (PermissionError, OSError) as e:
                time.sleep(0.5)
            except Exception as e:
                print(f"[Watcher] Error parsing {path.name}: {e}")
                return False
        return False

    def on_created(self, event: FileSystemEvent) -> None:
        if event.is_directory:
            return
        path = Path(event.src_path)
        if self._is_valid_file(path):
            print(f"[Watcher] Detected new file: {path.name}")
            self._safe_parse_and_index(path)

    def on_modified(self, event: FileSystemEvent) -> None:
        if event.is_directory:
            return
        path = Path(event.src_path)
        if self._is_valid_file(path):
            print(f"[Watcher] Detected modified file: {path.name}")
            self._safe_parse_and_index(path)

    def on_deleted(self, event: FileSystemEvent) -> None:
        if event.is_directory:
            return
        path = Path(event.src_path)
        if self._is_valid_file(path):
            print(f"[Watcher] Detected deleted file: {path.name}")
            self.store.remove(path.name)
            if self.callback:
                self.callback("removed", path.name)


class PaperWatcher:
    """
    Manages the watchdog observer for the ./watch_papers directory.
    """

    def __init__(self, store: DocumentStore, watch_dir: Path = WATCH_DIR) -> None:
        self.store = store
        self.watch_dir = watch_dir
        self.watch_dir.mkdir(parents=True, exist_ok=True)
        self.event_handler = PaperFileHandler(self.store, self._log_event)
        self.observer = Observer()

    def _log_event(self, action: str, filename: str) -> None:
        if action == "indexed":
            sections = self.store.list_sections(filename)
            print(f"[Store] Synced '{filename}' with {len(sections)} sections into in-memory store.")
        elif action == "removed":
            print(f"[Store] Removed '{filename}' from in-memory store.")

    def scan_existing_files(self) -> int:
        """Scan and ingest all existing documents currently in the watch folder."""
        count = 0
        for item in self.watch_dir.iterdir():
            if item.is_file() and self.event_handler._is_valid_file(item):
                if self.event_handler._safe_parse_and_index(item):
                    count += 1
        return count

    def start(self) -> None:
        """Start the watchdog observer."""
        self.observer.schedule(self.event_handler, str(self.watch_dir), recursive=False)
        self.observer.start()
        print(f"[Watcher] Monitoring active on directory: {self.watch_dir.resolve()}")

    def stop(self) -> None:
        """Stop the watchdog observer."""
        self.observer.stop()
        self.observer.join()
        print("[Watcher] Stopped monitoring.")
