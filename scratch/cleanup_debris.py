import sys

def delete_lines(file_path, start_line, end_line):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Lines are 1-indexed, so we subtract 1
    # We want to delete from start_line to end_line (inclusive)
    # So we keep lines before start_line-1 and after end_line-1
    new_lines = lines[:start_line-1] + lines[end_line:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    delete_lines(r'd:\Personal\Project\ShortlistMe\src\app\dashboard\portfolio\page.tsx', 668, 750)
